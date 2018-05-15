## eHunter - CV Filtering (Backend)

![](https://github.com/heryvandoro/ehunter-backend/blob/master/images/logo.png?raw=true)

This is a backend repository for eHunter - CV Filtering System. Built with NodeJS (ExpressJS + SequelizeJS ORM)

## How to use
- Clone this repository `git clone https://github.com/heryvandoro/ehunter-backend`
- run `npm install`
- Get your own service account auth file (.json) with [this step](https://cloud.google.com/vision/docs/auth)
- Place at the root project folder, and config `constant.js` based on your key name. 
- run `index.js` with your preferred tool. (maybe nodemon/pm2)

## Features
- Import CV with several filetypes (.doc, .docx, .pdf, .jpg, .png, .jpeg, .xls, .xlsx)
- Download report as xls
- Ranking and sorting system by scoring
- Filter CV based on criteria (gender, skills, degree status, gpa score)
- Cloud Storage integrated for storing files.
- Auto reporting by email
- 2 layer verification by uploading ID Card (check card holder name with registered name)
- Send feedback automatically by email.

## Credits
* Hery Vandoro
* Mario Viegash
* Pribadi Ridwan Mulyono

## License
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
