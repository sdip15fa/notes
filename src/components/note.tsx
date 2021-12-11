import {Editor} from "@tinymce/tinymce-react";
function Note(props:any) {
    return (
      <div className='editor'>
      <Editor
      id={props.id}
      onEditorChange={props.changehandler}
      initialValue={props.text}
      init={{
        height: 300,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
        }}
      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.2/tinymce.min.js"
    />
    <br/>
    </div>
    )
}
export default Note;