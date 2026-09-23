/**
 * A file the reader attached, read in the browser and never uploaded.
 *
 * kind says how the text was got, because it changes how far it can be
 * trusted: a PDF's own text layer is exact, an image's is a machine's reading
 * of a picture and comes with the mistakes that implies.
 */
export type Attached = {name: string; text: string; kind?: 'pdf' | 'image'};

/**
 * A page attached as context for the conversation, either by the host through
 * the element's `attachPage` method or by the reader from the page search.
 *
 * An empty `markdown` is the honest failure: the page could not be fetched,
 * and the panel says so rather than pretending.
 */
export type PageAttachment = {title: string; url: string; markdown: string};
