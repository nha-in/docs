# Deploying docs-mcp on NHA's EKS

One stateless container: a 22 MB binary with the 7.4 MB read-only catalogue
snapshot baked into the image. No database server, no queue, no volume, no
sidecar. The only AWS dependency is Bedrock, reached through the pod's IAM
role (IRSA); no credential is ever configured.

## Order of operations

1. **IRSA**: create an IAM role trusting the cluster's OIDC provider for the
   `docs-mcp` service account in the `abdm-docs` namespace,
   with `iam/bedrock-invoke-policy.json` attached. Put the role ARN into the
   annotation in `deployment.yaml`.
2. **Image**: CI pushes to ECR (OIDC role assumption, no long-lived keys).
   Put the image URI into `deployment.yaml`.
3. `kubectl -n abdm-docs apply -f deploy/nha/`
4. **If the platform team runs ArgoCD**: apply `argocd/application.yaml`
   once instead of step 3; CI then only builds, pushes and commits the new
   image tag, and never needs cluster access.
5. **Workflows**: copy `workflows/*.yml` into `.github/workflows/` and set
   the repository variables each file names at its top. Site deploys on
   push to main; the MCP deploys on a `v*` tag.
6. Point the ingress host at the cluster's ingress controller or gateway;
   this file carries a plain Ingress as the neutral default, replace with the
   house standard (ALB controller annotations, Istio, etc.) as needed.

## What failure looks like, on purpose

The server refuses to start rather than serve degraded: a missing
EMBED_PROVIDER, an unreachable model, a missing IAM permission or an index
built by a different provider all fail the readiness probe and the rollout.
The previous ReplicaSet keeps serving. The startup log names the exact
problem.

## Sizing

Two replicas for availability, preferring separate nodes, with a
disruption budget keeping one serving through drains. Each pod: requests
250m/512Mi, limits 1 vCPU/1Gi, with headroom for memory-cached reads of
the snapshot.
