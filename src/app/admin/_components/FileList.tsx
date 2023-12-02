export interface FileListInterface {
  id: string;
  name: string;
  type: string;
  size: number;
  awsKey: string;
  createdAt: Date || null;
  modifiedAt: Date || null;
}
