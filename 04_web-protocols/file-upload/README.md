# Handling file uploads

Uploading a file to the web is a common activity, be it an image, a video, or a document. Files
require different handling compared to simple `POST` data. Browsers embed files being uploaded into
multipart messages.

Multipart messages allow multiple pieces of content to be combined into one payload. To handle
multipart messages, we need to use a multipart parser.

In this recipe, we will use the `formidable` module as our multipart parser to handle file uploads.
The file uploads in this recipe will be stored on disk.

## How it works…

In the first step in the recipe, we set up an HTML form with a file input. The `enctype="multipart/form-data"`
property on the form element instructs the browser to set the `Content-Type` header
of the request to `multipart/form-data`. This also instructs the browser to embed the files to be
uploaded into a multipart message.

The `post()` function checks that the `Content-Type` header is set to `multipart/form-data`.
If this header isn’t set, we call our error function and return a `415` HTTP status code with the message
`Unsupported Media Type`.

Within the `post()` function, we initialized a `formidable` object with configuration options and
assigned it to a constant named form:

```JavaScript
  const form = formidable({
    keepExtensions: true,
    uploadDir: './uploads'
  });
```

The first configuration option, `keepExtensions:true`, instructs `formidable` to preserve the file
extension of the file being uploaded. The `uploadDir` option is used to instruct formidable where
the uploaded files should be stored, and in the case of our recipe, we set this to the uploads directory.

Next, we call the `form.parse()` function. This function parses the request and collects the form
data within the request. The parsed form data is passed to our callback function as an array of fields
and an array of files.

Within our `form.parse()` callback function, we first check if any errors occurred during the `form.parse()`
function and return an error if there was one. Assuming the form data was successfully
parsed, we return our response to the request, which is an HTTP status code `200, OK`. We also return
the information `formidable` provides by default about our uploaded file, in a string representation
of the JSON format.

The `formidable` library in Node.js uses random filenames when uploading files to prevent conflicts.
Assigning unique names helps to avoid issues such as file overwriting, where multiple users might
upload files with the same name, potentially replacing existing data. This method also helps mitigate
security risks associated with user input by preventing deliberate attempts to overwrite sensitive files
or predict and access files on the server.

This recipe demonstrates how community modules such as `formidable` can do the heavy lifting
and handle complex, but common, problems. In this instance, it saved us from writing a multipart
parser from scratch.

**Important note:**
Allowing the upload of any file type of any size makes your server vulnerable to **Denial-of-Service (DoS)**
attacks. Attackers could purposely try to upload excessively large or malicious
files to slow down your server. It is recommended that you add both client-side and server-side
validation to restrict the file types and sizes that your server will accept.

### Uploading multiple files

In some cases, you may want to upload multiple files to a server at the same time. Conveniently, with
`formidable`, this is supported by default. We just need to make one change to our `form.html`
file, which is to add the `multiple` attribute to the input element.

Start the server with `node server.js` and navigate to <http://localhost:3000>. Now,
when you click **Upload**, you should be able to select multiple files to upload. On macOS, to select
multiple files, you can hold the Shift key and select multiple files. Then, upon submitting multiple files,
`formidable` will return data about each of the files uploaded. Expect to see JSON output returned
that is like the following:

```Json
{
  "fields": {},
  "files": {
    "userfile": [
      {
        "size": 334367,
        "filepath": "/file-upload/uploads/8bcdb0be88a49a8e1aec95e00.jpg",
        "newFilename": "8bcdb0be88a49a8e1aec95e00.jpg",
        "mimetype": "image/jpeg",
        "mtime": "2024-04-15T02:57:23.589Z",
        "originalFilename": "photo.jpg"
      },
      {
        "size": 21,
        "filepath": "/file-upload/uploads/8bcdb0be88a49a8e1aec95e01.txt",
        "newFilename": "8bcdb0be88a49a8e1aec95e01.txt",
        "mimetype": "text/plain",
        "mtime": "2024-04-15T02:57:23.589Z",
        "originalFilename": "file.txt"
      }
    ]
  }
}
```

### Processing multiple input types

It’s common for a form to contain a mixture of input types. On top of the file input type, it could contain
text, a password, a date, or more input types. The `formidable` module handles mixed data types.

**HTML input element:**
For a full list of input types defined, refer to the MDN web documentation at
<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input>.

Let’s extend the HTML form created in the recipe to contain some additional text input fields to
demonstrate how formidable handles multiple input types.

Start the server with `node server.js` and navigate to <http://localhost:3000>. Insert text
into the user field and select a file to be uploaded. Click on Submit.
You will receive a JSON response containing all your form data, like the following:

```Json
{
  "fields": { "user" : ["User"] },
  "files": {
    "userfile": [
      {
        "size": 21,
        "filepath": "/file-upload/uploads/659d0cc8a8898fce93231aa00.txt",
        "newFilename": "659d0cc8a8898fce93231aa00.txt",
        "mimetype": "text/plain",
        "mtime": "2024-04-15T02:59:22.633Z",
        "originalFilename": "file.txt"
      }
    ]
  }
}
```

The field information is automatically handled by the form.parse() function, making the fields
accessible to the server.
