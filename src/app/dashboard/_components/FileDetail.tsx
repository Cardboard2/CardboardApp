export interface FileDetail {
    objectType: string
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
    objectType: "Unknown",
    name: "Unknown",
    id: "Unknown",
    type: "Unknown"
};