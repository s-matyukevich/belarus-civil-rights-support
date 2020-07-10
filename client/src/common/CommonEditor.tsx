import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const CommonEditor: React.FC<{ content: string; onChange: (constent: string) => void }> = ({ content, onChange }) => {
  return (
    <Editor
      apiKey="3njbhu02u8g7w4t6rrobxuj1o0ogdx5pi2c63lb29vtl0vc4"
      value={content}
      init={{
        height: 350,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify |' +
          ' bullist numlist outdent indent | removeformat | help'
      }}
      onEditorChange={onChange}
    />
  );
};

export default CommonEditor;
