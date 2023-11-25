export interface FileDetail {
    objectFile: string
    name: string
    type?: string
    size?: number
    createdAt?: Date
    modifiedAt?: Date
    id: string
};

export interface FormInput {
    files: FileList
}

export const defaultFileDetail: FileDetail = {
    objectFile: "Unknown",
    name: "Unknown",
    id: "Unknown"
};