//test gitupload
import express from 'express';
import bodyParser from 'body-parser';
// import functionality for URL verification
import { StringUtils } from 'turbocommons-ts';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
app.get("/filteredimage", async (req , res) =>{
  //debug check
  //console.log(req.route)
  //res.send( "filteredimage received" );
  //console.log( "filteredimage received: "+ imageUrl );

  const imageUrl = req.query.image_url;
  
  // check if URL is valid 
  // check method provided by "turbocommons-ts"
  // console log and http response as error handling for invalid URL
  // !start URL check
  const checkResult = StringUtils.isUrl(imageUrl);
  if (checkResult === false)
  {
    console.log("Is the URL a valid URL Check result: " + checkResult);
    return res.status(422).send(
      `<!DOCTYPE html>
      <html>
          <head>
              <meta charset="utf-8">
              <title>Error in URL detected</title>
          </head>
          <body>
              <h2 style="color:red">An error was detected when trying to parse the provided URL</h2>
              <h2 style="border: 10mm;">`
              + imageUrl +
              ` </h2>
              <h2 style="border: 10mm;"> A valid URL is required </h2>
          </body>
      </html>
       `);
  }
  //! end of URL check
  
  //get the image using the provided utilities
  const receivedImage = await filterImageFromURL(imageUrl);

  res.status(200)
       .sendFile(receivedImage, {}, async (err) => {
          if (err) {
            throw new Error('The file transfer failed'); 
          }

          await deleteLocalFiles([receivedImage]);
       });
  } );



  //! END @TODO1
  

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();