module.exports = function(content)
{
  return `<style>
   *{
      box-sizing: border-box;
      text-align: justify;
   }
   a{
      color: #a62b24;
      text-decoration: none;
   }
   .btn {
       padding: 10px 15px;
       background-color: #a62b24;
       display: table;
       margin: 0 auto;
       color: #fff;
       width: auto;
       margin-bottom: 20px;
       border: none;
       font-size: 17px;
   }
   p{
      color: #666;
      margin-top: 0;
      margin-bottom: 25px;
      line-height: 1.4;
   }
   p strong{
      color: #000;
   }
   .wrapper{
      width: 600px;
      max-width: 100%;
      background-color: #fff;
      margin: 10% auto;
      border-radius: 5px 5px 0 0;
      box-shadow: 0 0 10px 1px #ccc;
      font-weight: 500;
   }
   .container{
      padding: 5%;
   }
   bode{
    background-color:#f4f4f4;
    margin:0;
    font-family:aerial;
    font-size:17px;
   }
</style>
<meta name="viewport" content="width=device-width, initial-scale=1">
<body bgcolor="#f4f4f4" style="margin: 0; font-family: arial; font-size: 17px;">
   <div class="wrapper">
      <div class="header">
         <div class="container">
            <div class="logo" style="margin: 20px 0;">
               <img src="http://portaltest.bullseyesalesevents.com/assets/img/logo.png" style="width:50%; max-width: 270px;">
            </div>

            <div class="content">
               ${content}
            </div>
         </div>
      </div>
      <div class="footer">
         <img src="https://johnnysitaliansteakhouse.com/wp-content/uploads/2018/03/Corporate-Events-Meetings-Cover.jpg" style="width: 100%;">
   </div>
</body>`; // eslint-disable-line
};
