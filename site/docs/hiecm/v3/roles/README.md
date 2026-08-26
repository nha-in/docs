# Roles

One page per integrator role, giving the ordered path through the modules for
that role.

A role is declared on each specification as `info.x-abdm-roles`, and the role
switcher in the sidebar scopes the API tree to it. These pages are the prose
half of the same idea: which modules are yours, and in what order to build
them. A module serving two roles is named on both pages, because roles and
modules are many to many.

The choices a reader is offered come from `site/src/config/roles.ts`. Adding a
role means adding a page here and an entry there.
