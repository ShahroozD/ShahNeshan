const emojiDictionary = {
  ":tent:": "⛺",
  ":joy:": "😂",
  ":heart:": "❤️",
  ":smile:": "😄",
  ":thumbsup:": "👍",
  ":grin:": "😁",
  ":wink:": "😉",
  ":blush:": "😊",
  ":sunglasses:": "😎",
  ":cry:": "😢",
  ":sob:": "😭",
  ":angry:": "😠",
  ":astonished:": "😲",
  ":scream:": "😱",
  ":confused:": "😕",
  ":tired_face:": "😫",
  ":stuck_out_tongue:": "😛",
  ":money_mouth_face:": "🤑",
  ":thinking:": "🤔",
  ":face_with_rolling_eyes:": "🙄",
  ":neutral_face:": "😐",
  ":expressionless:": "😑",
  ":grinning:": "😀",
  ":thumbsdown:": "👎",
  ":clap:": "👏",
  ":wave:": "👋",
  ":pray:": "🙏",
  ":ok_hand:": "👌",
  ":muscle:": "💪",
  ":peace:": "✌️",
  ":100:": "💯",
  ":fire:": "🔥",
  ":poop:": "💩",
  ":star:": "⭐",
  ":sparkles:": "✨",
  ":zap:": "⚡",
  ":sunny:": "☀️",
  ":cloud:": "☁️",
  ":umbrella:": "☔",
  ":snowflake:": "❄️",
  ":cat:": "🐱",
  ":dog:": "🐶",
  ":rabbit:": "🐰",
  ":panda_face:": "🐼",
  ":koala:": "🐨",
  ":pig:": "🐷",
  ":monkey_face:": "🐵",
  ":bird:": "🐦",
  ":frog:": "🐸",
  ":fish:": "🐟",
  ":whale:": "🐳",
  ":rocket:": "🚀",
  ":airplane:": "✈️",
  ":car:": "🚗",
  ":taxi:": "🚕",
  ":bus:": "🚌",
  ":train:": "🚆",
  ":bicycle:": "🚲",
  ":soccer:": "⚽",
  ":basketball:": "🏀",
  ":football:": "🏈",
  ":tennis:": "🎾",
  ":video_game:": "🎮",
  ":trophy:": "🏆",
  ":bell:": "🔔",
  ":gift:": "🎁",
  ":balloon:": "🎈",
  ":party_popper:": "🎉",
  ":sparkler:": "🎇",
  ":tada:": "🎉",
  ":cake:": "🍰",
  ":chocolate_bar:": "🍫",
  ":coffee:": "☕",
  ":beer:": "🍺",
  ":wine_glass:": "🍷",
  ":pizza:": "🍕",
  ":hamburger:": "🍔",
  ":fries:": "🍟",
  ":spaghetti:": "🍝",
  ":sushi:": "🍣",
  ":apple:": "🍎",
  ":banana:": "🍌",
  ":cherry_blossom:": "🌸",
  ":rose:": "🌹",
  ":sunflower:": "🌻",
  ":tulip:": "🌷",
  ":cactus:": "🌵",
  ":maple_leaf:": "🍁",
  ":fallen_leaf:": "🍂",
  ":leaves:": "🍃",
  ":christmas_tree:": "🎄",
  ":gift_heart:": "💝",
  ":crown:": "👑",
  ":kiss:": "💋",
  ":lips:": "👄",
  ":ring:": "💍",
  ":gem:": "💎",
  ":moneybag:": "💰",
  ":camera:": "📷",
  ":phone:": "📱",
  ":laptop:": "💻",
  ":hourglass:": "⌛",
  ":bulb:": "💡",
  ":mag:": "🔍",
  ":lock:": "🔒",
  ":key:": "🔑",
  ":hammer:": "🔨",
  ":wrench:": "🔧",
  ":scissors:": "✂️",
  ":pill:": "💊",
  ":syringe:": "💉",
  ":toilet:": "🚽",
  ":bath:": "🛁",
  ":hourglass_flowing_sand:": "⏳",
  ":watch:": "⌚",
};


// Function to replace emoji shortcodes with actual emojis
export function replaceEmojiShortcodes(text) {
  return text.replace(/:\w+:/g, (shortcode) => {
      return emojiDictionary[shortcode] || shortcode; // Use the dictionary, or keep the text if not found
  });
}
