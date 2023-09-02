const { AttachmentBuilder, ImportantGatewayOpcodes } = require('discord.js')
const fs = require('fs');

const nodeHtmlToImage = require('node-html-to-image')

module.exports = async (m, name) => {

  const _htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      body {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        background: rgb(22, 22, 22);
        color: #fff;
        max-width: 300px;
      }

      .app {
        max-width: 300px;
        padding: 20px;
        display: flex;
        flex-direction: row;
        border-top: 3px solid rgb(16, 180, 209);
        background: rgb(31, 31, 31);
        align-items: center;
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 5px;
      }
    </style>
  </head>
  <body>
    <div class="app">
      <img src="https://avatars.dicebear.com/4.5/api/avataaars/${name}.svg" />

      <h4>Welcome ${name}</h4>
    </div>
  </body>
</html>
`

  const images = await nodeHtmlToImage({
    html: _htmlTemplate,
    quality:100,
    type: 'jpeg',
    content: [{ name: `${name}`, output: `./src/temp/${name}.jpeg` }],
    puppeteerArgs: {
      args: ['--no-sandbox'],
    },
  }).then(() => console.log('The image was created successfully!'))

  const imageAttachment = new AttachmentBuilder(images, `${name}.jpeg`);

  return (m.channel.send({
    content:'test',
    files:[{
       attachment: `./src/temp/${name}.jpeg`
    }]
  }).then(()=> {fs.unlinkSync(`./src/temp/${name}.jpeg`)}))
}