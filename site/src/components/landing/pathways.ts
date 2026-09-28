/**
 * What each gateway card means on the network behind it.
 *
 * The network is the same eight participants whichever card is asked about.
 * A pathway only says which of them the journey runs through, which stand
 * beside it, and what moves between them in what order. NetworkWeb derives
 * the layout, the lit links and the travelling record from this table, so a
 * new journey is a new entry here and not a new animation.
 *
 * Every route is taken from the concept pages, not drawn for the picture:
 * the participants section for HIE-CM, the UHI gateway page for UHI, and
 * claim settlement for NHCX. The gateway in every route is the NHA node,
 * because NHA operates all three gateways and routes the calls on each.
 */

export type Stage = {
  /** The step, as a caption on the map. */
  label: string;
  /** What the board says while this step runs. At most 29 characters. */
  line: string;
  /** Participant ids, in the order the message travels. */
  route: string[];
  /** Where the caption sits. The route's last participant when omitted. */
  at?: string;
};

export type Pathway = {
  /** The gateway's short name, as the card shows it. */
  gateway: string;
  /** The participant that stands for the gateway on this pathway. */
  hub: string;
  /** On the route. Everyone else on the network is background. */
  primary: string[];
  /** Beside the route: the same role as a primary, or the far end of it. */
  context: string[];
  stages: Stage[];
};

export const PATHWAYS: Record<string, Pathway> = {
  'HIE-CM': {
    gateway: 'HIE-CM',
    hub: 'nha',
    primary: ['citizen', 'phr', 'nha', 'hospital', 'doctor'],
    // A laboratory and a pharmacy share records as a hospital does, and an
    // insurer reads them under consent as a doctor does.
    context: ['lab', 'pharmacy', 'insurer'],
    stages: [
      {
        label: 'Identify',
        line: 'An ABHA for the citizen',
        route: ['citizen', 'phr', 'nha'],
      },
      {
        label: 'Link',
        line: 'Records linked to the ABHA',
        route: ['hospital', 'nha', 'phr'],
      },
      {
        label: 'Consent',
        line: 'The citizen grants consent',
        route: ['doctor', 'nha', 'phr'],
      },
      {
        // The record itself goes provider to user, encrypted. The gateway
        // carried the consent, not the data.
        label: 'Share',
        line: 'Records reach the doctor',
        route: ['hospital', 'doctor'],
      },
    ],
  },
  UHI: {
    gateway: 'UHI',
    hub: 'nha',
    primary: ['citizen', 'phr', 'nha', 'doctor'],
    // Other services on the network: a hospital, a pharmacy, a laboratory.
    context: ['hospital', 'pharmacy', 'lab'],
    stages: [
      {
        // Discovery is the one step through the gateway, broadcast to every
        // provider app on the network.
        label: 'Discover',
        line: 'Search every provider at once',
        route: ['citizen', 'phr', 'nha', 'doctor'],
      },
      {
        // Everything after discovery is point to point.
        label: 'Book',
        line: 'Book the chosen provider',
        route: ['phr', 'doctor'],
      },
      {
        label: 'Fulfil',
        line: 'Care delivered as booked',
        route: ['doctor', 'citizen'],
      },
    ],
  },
  NHCX: {
    gateway: 'NHCX',
    hub: 'nha',
    primary: ['hospital', 'nha', 'insurer'],
    context: ['citizen', 'doctor'],
    stages: [
      {
        label: 'Eligibility',
        line: 'Policy checked before care',
        route: ['hospital', 'nha', 'insurer'],
      },
      {
        label: 'Pre-auth',
        line: 'Treatment approved up front',
        route: ['hospital', 'nha', 'insurer'],
      },
      {
        label: 'Claim',
        line: 'Claim sent after discharge',
        route: ['hospital', 'nha', 'insurer'],
      },
      {
        label: 'Adjudication',
        line: 'Claim decided, with reasons',
        route: ['insurer', 'nha', 'hospital'],
      },
    ],
  },
};
