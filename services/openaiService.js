// const { OpenAI } = require('openai');

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const analyzeContent = async (content) => {
//   const response = await openai.completions.create({
//     model: "gpt-3.5-turbo",
//     prompt: `Categorize the following email content: ${content}`,
//     max_tokens: 60,
//   });
//   return response.choices[0].text.trim();
// };

// module.exports = { analyzeContent };

// const { AI } = require('@gemini/ai');

// const gemini = new AI({ apiKey: process.env.GEMINI_API_KEY });

// const analyzeContent = async (content) => {
//   const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const prompt = `Categorize the following email content: ${content}`;
//   const result = await model.generate(prompt);
//   return result.text.trim();
// };

// module.exports = { analyzeContent };


const { GoogleGenerativeAI } = require("@google/generative-ai");


const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
async function analyzeContent(content) {
  //  console.log(content);
   const result = await model.generateContent(`find 10 key words from this mail : ${content}`);

  const response = await result.response;
  const text = response.text();

  console.log(text);
  return text;
}


// async function analyzeContent(content) {
//   const result =await model.generateContent(`I am using gemini api to automate the mail reply so just reply to this : ${content}  Don't write anything extra because this mail is  begin sent to people directly and reply in brief`);


//   const response = await result.response;
//   const text = response.text();

//   // if (text.includes("Interested")) {
//   //   return "Interested";
//   // } else if (text.includes("Not Interested")) {
//   //   return "Not Interested";
//   // } else {
//   //   return "More Information";
//   // }
//   console.log(text);
//   return text;
// }

module.exports = { analyzeContent };


