import { Target } from '../target/target.entity';
export type MutationId = string;
export type Mutation = {
    id: MutationId;
    metadata: {
        name?: string;
        description?: string;
        image?: {
            ipfs_cid?: string;
        };
    };
    apps: string[];
    targets: Target[];
};
export type MutationWithSettings = Mutation & {
    settings: {
        isFavorite: boolean;
        lastUsage: string | null;
    };
};
//# sourceMappingURL=mutation.entity.d.ts.map