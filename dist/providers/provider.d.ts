import { IContextNode } from "../core/tree/types";
import { ParserConfig } from "../core/parsers/json-parser";
import { BosParserConfig } from "../core/parsers/bos-parser";
export type UserLinkId = string;
export type BosUserLink = {
    id: UserLinkId;
    namespace: string;
    contextType: string;
    contextId: string | null;
    insertionPoint: string;
    bosWidgetId: string;
    authorId: string;
};
export type LinkTemplate = {
    id: string;
    namespace: string;
    contextType: string;
    contextId: string | null;
    insertionPoint: string;
    bosWidgetId: string;
};
export interface IProvider {
    getLinksForContext(context: IContextNode): Promise<BosUserLink[]>;
    createLink(link: Omit<BosUserLink, "id" | "authorId">): Promise<BosUserLink>;
    getParserConfig(namespace: string): Promise<ParserConfig | BosParserConfig | null>;
    createParserConfig(parserConfig: ParserConfig | BosParserConfig): Promise<void>;
    getLinkTemplates(bosWidgetId: string): Promise<LinkTemplate[]>;
    createLinkTemplate(linkTemplate: Omit<LinkTemplate, "id">): Promise<LinkTemplate>;
    deleteUserLink(userLink: Pick<BosUserLink, "id" | "bosWidgetId">): Promise<void>;
}
//# sourceMappingURL=provider.d.ts.map