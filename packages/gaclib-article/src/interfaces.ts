export interface Text {
    kind: 'Text';
    text: string;
}

export interface PageLink {
    kind: 'PageLink';
    href: string;
    content: Content[];
}

export interface AnchorLink {
    kind: 'AnchorLink';
    anchor: string;
    content: Content[];
}

export interface Name {
    kind: 'Name';
    text: string;
}

export interface Image {
    kind: 'Image';
    href: string;
    caption: string;
}

export interface ContentListItem {
    kind: 'ContentListItem';
    content: Content[];
}

export interface ParagraphListItem {
    kind: 'ParagraphListItem';
    content: Paragraph[];
}

export interface List {
    kind: 'List';
    ordered: string;
    items: (ContentListItem | ParagraphListItem)[];
}

export interface Strong {
    kind: 'String';
    content: Content[];
}

export interface Emphasise {
    kind: 'Emphasise';
    content: Content[];
}

export interface Program {
    kind: 'Program';
    project?: string;
    language?: string;
    code: string;
    output?: string;
}

export type Content =
    | Text
    | PageLink
    | AnchorLink
    | Name
    | Image
    | List
    | Strong
    | Emphasise
    | Program
    ;

export interface Paragraph {
    kind: 'Paragraph';
    content: Content[];
}

export interface Topic {
    kind: 'Topic';
    anchor?: string;
    title: string;
    content: (Paragraph | Topic)[];
}

export interface Article {
    index: boolean;
    numberBeforeTitle: boolean;
    topic: Topic;
}
