/// <reference types="react" />
export type ModalProps = {
    subject: string;
    body: string;
    type: 'error' | 'info' | 'warning';
    id: number;
    actions: {
        label: string;
        onClick: () => void;
    }[];
};
export type ModalContextState = {
    notify: (modalProps: ModalProps) => void;
};
export declare const contextDefaultValues: ModalContextState;
export declare const ModalContext: import("react").Context<ModalContextState>;
//# sourceMappingURL=modal-context.d.ts.map