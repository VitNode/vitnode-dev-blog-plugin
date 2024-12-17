interface JSONContentType {
  attrs?: {
    dir_folder?: string;
    file_name?: string;
    file_name_original?: string;
    file_size?: number;
    height?: number;
    id: number;
    mimetype?: string;
    width?: number;
  };
  content?: JSONContentType[];
  type: string;
}

export const getImagesFromEditorContent = (content: string) => {
  const files: {
    dir_folder: string;
    file_name: string;
    id: number;
    mimetype: string;
  }[] = [];

  const mapContent = (values: JSONContentType[]) => {
    values.forEach(value => {
      if (!value.attrs) return;

      // Get all file ids
      if (
        value.type === 'fileNode' &&
        !files.find(file => file.id === value.attrs?.id) &&
        value.attrs.dir_folder &&
        value.attrs.height &&
        value.attrs.width &&
        value.attrs.file_name &&
        value.attrs.mimetype
      ) {
        files.push({
          id: value.attrs.id,
          dir_folder: value.attrs.dir_folder,
          file_name: value.attrs.file_name,
          mimetype: value.attrs.mimetype,
        });
      }

      if (value.content) {
        mapContent(value.content);
      }
    });
  };

  try {
    const json = JSON.parse(content).content as JSONContentType[];

    mapContent(json);
  } catch (_) {
    // Skip if content is not JSON
  }

  return files;
};
