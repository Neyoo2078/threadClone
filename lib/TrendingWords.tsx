import { flagedWords } from './data';
export const getTrendingTopics = (tweets: any) => {
  const wordCount: any = {};

  tweets.forEach((tweet: any) => {
    const words = tweet.message.split(/\s+/);

    words.forEach((word: string) => {
      // Remove special characters and convert to lowercase
      const cleanWord = word
        .replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '')
        .toLowerCase();

      if (cleanWord && cleanWord.length > 1) {
        if (!wordCount[cleanWord]) {
          wordCount[cleanWord] = [tweet];
        } else {
          const exist = wordCount[cleanWord].find(
            (items: any) => items._id === tweet._id
          );
          if (exist) {
            return;
          } else {
            wordCount[cleanWord].push(tweet);
          }
        }
      }
    });
  }); // Convert wordCount object to an array of objects

  const sortedWords = Object.entries(wordCount)
    .map(([word, tweet]: any) => ({ word, tewwts: tweet, count: tweet.length }))
    .sort((a: any, b: any) => b.count - a.count);
  const finalfilter = sortedWords.filter(
    (items) => !flagedWords.includes(items.word)
  );

  // Select the top trending topics (e.g., top 10)
  const topTopics = sortedWords.slice(0, 5);
  return topTopics;
};
