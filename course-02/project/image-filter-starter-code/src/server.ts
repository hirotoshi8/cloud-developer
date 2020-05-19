import express from 'express';
import {Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
//import { url } from 'inspector';

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
  app.get( "/filteredimage",
    async ( req: Request, res: Response ) => {
      //1. validate the image_url query
      // destruct our path params
      let image_url = req.query.image_url;
      console.log(image_url);
      // check to make sure the id is set
      if (!image_url) { 
        // respond with an error if not
        return res.status(400).send(`url is required`);
      }
      //2. call filterImageFromURL(image_url) to filter the image
      let filtered_image = await filterImageFromURL("image_url");

      //3. send the resulting file in the response
      // respond not found, if we do not have this request
      if(filtered_image && filtered_image.length === 0) {
          return res.status(404).send(`Request is not found`);
      }else{
          return res.status(200).sendfile(filtered_image);
      }
      //4. deletes any files on the server on finish of the response
      await deleteLocalFiles([filtered_image]);
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    //res.send("try GET /filteredimage?image_url={{}}")
    res.send(("/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg"));
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();