// Original training corpus for the in-browser trigram model — ~1,500 short,
// simple, present-tense subject–verb–object sentences written for this
// project. No copied text. The corpus is deliberately pattern-heavy: common
// phrases and structures repeat often so the trigram statistics are strong
// and the model writes more coherent text. Every sentence ends with a period.
const CORPUS = [];
const add = (s) => CORPUS.push(s);

// One sentence per subject × verb pair, rotating the objects so each object
// appears evenly. Keeps a block's size at |subjects| × |verbs|.
const cross = (subs, verbs, objs) => {
  subs.forEach((s, i) => {
    verbs.forEach((v, j) => {
      add(`${s} ${v} ${objs[(i + j) % objs.length]} .`);
    });
  });
};

// Every subject × verb × object combination.
const full = (subs, verbs, objs) => {
  for (const s of subs)
    for (const v of verbs) for (const o of objs) add(`${s} ${v} ${o} .`);
};

// ---- animals ----
const animals = [
  "the cat",
  "the dog",
  "the bird",
  "the kitten",
  "the puppy",
  "the rabbit",
  "the old cat",
  "the big dog",
  "the small bird",
  "the mouse",
];

cross(
  animals,
  ["sleeps on", "sits on", "rests on", "waits by", "hides under", "jumps on", "plays near", "lies on"],
  ["the mat", "the rug", "the chair", "the bed", "the sofa", "the floor", "the porch", "the wall", "the table", "the step"]
);

cross(
  animals,
  ["eats", "wants", "likes", "sees", "finds"],
  ["the food", "the bread", "the fish", "the rice", "the fruit", "the grass", "the seeds", "the corn"]
);

full(
  ["the cat", "the dog", "the kitten", "the puppy", "the horse"],
  ["drinks"],
  ["the milk", "the water"]
);

cross(
  animals,
  ["sleeps", "waits", "plays", "rests", "hides", "runs"],
  ["at night", "in the morning", "in the evening", "in the garden", "in the yard", "in the sun"]
);

// ---- people at home ----
const people = [
  "my mother",
  "my father",
  "my sister",
  "my brother",
  "my friend",
  "the man",
  "the woman",
  "the boy",
  "the girl",
  "grandma",
];

cross(
  people,
  ["cleans", "opens", "closes", "paints", "fixes", "watches"],
  ["the kitchen", "the window", "the door", "the fence", "the chair", "the garden", "the house", "the gate"]
);

cross(
  people,
  ["makes", "cooks", "serves", "shares", "brings"],
  ["the tea", "the rice", "the soup", "the bread", "the salad", "the dinner", "the coffee", "the cake"]
);

cross(
  people,
  ["reads", "cooks", "works", "rests", "sings", "walks"],
  ["in the morning", "in the evening", "at night", "on sunday", "every day", "after dinner"]
);

// ---- school and reading ----
cross(
  ["the teacher", "the student", "the boy", "the girl", "my friend", "my sister", "the professor", "the writer"],
  ["reads", "writes", "studies", "learns", "finishes", "starts"],
  ["the book", "the lesson", "the story", "the letter", "the homework", "the notes", "the test", "the poem"]
);

[
  "the teacher writes on the board .",
  "the teacher reads to the class .",
  "the students listen to the teacher .",
  "the students ask good questions .",
  "the class starts at nine .",
  "the bell rings at noon .",
  "the library is quiet and warm .",
  "the school bus stops at the corner .",
  "the homework takes the whole evening .",
  "the exam starts on monday .",
  "the class plants a small garden .",
  "the kids draw pictures of their pets .",
  "the chalk squeaks on the old board .",
  "reading opens doors to other worlds .",
  "learning a language takes time and patience .",
  "the notebook is full of small drawings .",
  "the lesson is about the stars .",
  "the school is quiet in the summer .",
  "the students walk home together .",
  "the teacher smiles at the class .",
].forEach(add);

// ---- places and adjectives ----
const places = [
  "the house",
  "the room",
  "the street",
  "the school",
  "the garden",
  "the kitchen",
  "the city",
  "the park",
  "the library",
  "the station",
];

full(places, ["is"], ["quiet", "clean", "warm", "cold", "busy", "empty"]);

full(
  ["the internet", "the library", "the kitchen", "the garden", "the school", "the park", "the market", "the station"],
  ["is"],
  ["a quiet place", "a busy place", "a warm place", "a good place", "a big place", "a noisy place"]
);

// ---- weather ----
for (const a of ["nice", "cold", "warm", "wet", "windy", "cloudy", "sunny", "grey"]) {
  for (const t of ["today", "this morning", "this week"]) {
    add(`the weather is ${a} ${t} .`);
  }
}

full(
  ["the rain", "the snow"],
  ["falls on"],
  ["the roof", "the street", "the field", "the hills", "the garden", "the town"]
);
full(["the wind"], ["blows through", "blows over"], ["the trees", "the valley", "the street", "the field"]);
full(
  ["the sun"],
  ["shines on", "rises over", "sets behind"],
  ["the field", "the hills", "the sea", "the town", "the river"]
);
full(["the clouds"], ["move across", "drift over"], ["the sky", "the hills", "the city"]);

[
  "the storm passes before midnight .",
  "the fog covers the bridge at dawn .",
  "it rains all day .",
  "it rains in april .",
  "it snows in january .",
  "the air feels cold this morning .",
  "the air feels fresh after the rain .",
  "the sky turns grey before the storm .",
  "a warm breeze comes from the sea .",
  "the ice covers the pond .",
  "winter comes early this year .",
  "spring brings new leaves to the trees .",
  "the first snow falls in november .",
  "a rainbow appears after the rain .",
  "thunder rolls across the dark sky .",
  "the heat makes everyone slow .",
  "the forecast says rain for the weekend .",
  "the weather in the mountains changes fast .",
  "the morning is cool and clear .",
  "the evening is warm and still .",
].forEach(add);

// ---- city and travel ----
full(
  ["the bus", "the train", "the taxi", "the tram"],
  ["stops at", "waits at", "arrives at"],
  ["the station", "the corner", "the square", "the market"]
);
full(["the bus", "the train", "the boat", "the plane"], ["leaves at"], ["nine", "ten", "noon", "six"]);
full(
  ["we", "they", "the children", "the students"],
  ["walk to", "go to", "ride to"],
  ["the market", "the school", "the park", "the station"]
);
full(
  ["she", "he", "the man", "the woman"],
  ["walks to", "goes to", "rides to"],
  ["the market", "the school", "the park", "the station"]
);

[
  "the city wakes up before the sun .",
  "the streets are full of people .",
  "the old town has narrow streets .",
  "the bridge crosses the wide river .",
  "the market square is busy on friday .",
  "the museum is quiet on monday .",
  "the tower is the oldest building in town .",
  "the last bus leaves at midnight .",
  "a new bakery opens on our street .",
  "the lights of the city glow at night .",
  "the harbor is calm at sunset .",
  "the airport is crowded before the holiday .",
  "the map leads us to a small cafe .",
  "the train passes fields and small towns .",
  "street music echoes between the walls .",
  "the park in the center is always green .",
  "every city has its own sound .",
  "the boats come into the port at dusk .",
  "rain makes the city lights look soft .",
  "the shops close early on sunday .",
].forEach(add);

// ---- pronouns and everyday objects ----
full(["she", "he"], ["opens", "closes", "cleans"], ["the window", "the door", "the gate", "the box"]);
full(["she", "he"], ["reads", "writes"], ["the book", "the letter", "the note", "the story"]);
full(["she", "he"], ["takes", "brings", "finds"], ["the bag", "the cup", "the keys", "the phone"]);
full(
  ["we", "they", "i"],
  ["like", "want", "need"],
  ["the tea", "the bread", "the rice", "the soup", "the music", "the rain"]
);

// ---- meals ----
for (const food of ["bread", "rice", "eggs", "fruit", "soup", "fish", "pasta", "toast"]) {
  for (const meal of ["breakfast", "lunch", "dinner"]) {
    add(`we eat ${food} for ${meal} .`);
  }
}
for (const food of ["bread", "rice", "soup", "fruit"]) {
  for (const meal of ["breakfast", "lunch", "dinner"]) {
    add(`she eats ${food} for ${meal} .`);
  }
}

// ---- nature ----
full(
  ["the river", "the stream"],
  ["runs through", "flows through"],
  ["the valley", "the field", "the town", "the forest"]
);
full(["the trees", "the flowers"], ["grow on", "grow near"], ["the hill", "the river", "the wall", "the path"]);

[
  "the moon lights the path through the field .",
  "the stars fill the sky at night .",
  "the lake is still at dawn .",
  "the leaves fall in october .",
  "the forest smells of rain and earth .",
  "the waves crash on the grey rocks .",
  "the valley turns gold in autumn .",
  "the desert is cold at night .",
  "the sea looks different every day .",
  "the mountains hold snow into spring .",
  "the trail ends at a small waterfall .",
  "the moss grows on the north side of the trees .",
  "the island has one road and one shop .",
  "the garden hums with bees in june .",
  "wild horses live on the open plain .",
  "the birds sing in the tall trees .",
  "the birds fly south in the winter .",
  "the pond is quiet in the evening .",
  "the path leads to the old bridge .",
  "the hill looks green after the rain .",
].forEach(add);

// ---- colours, possessions, times ----
full(["the door", "the fence", "the wall", "the roof", "the car", "the boat"], ["is"], ["blue", "green", "white", "red"]);
full(
  ["her book", "his bag", "my cup", "the pen", "the phone", "her coat"],
  ["is on", "lies on"],
  ["the table", "the desk", "the shelf", "the chair"]
);
full(
  ["the class", "the lesson", "the game", "the show", "the market", "the movie"],
  ["starts at", "ends at"],
  ["nine", "ten", "noon", "five", "six"]
);

// ---- computers, the internet and AI (~245) ----
[
  "the internet is a network of computers .",
  "the internet is a global network .",
  "the internet is a big library .",
  "the internet is a noisy place .",
  "the internet is a useful tool .",
  "the internet connects the world .",
  "the internet connects people across the world .",
  "the internet never sleeps .",
].forEach(add);

full(
  ["the computer", "the laptop", "the phone", "the server"],
  ["runs", "loads", "opens", "saves", "closes"],
  ["the program", "the game", "the file", "the app", "the page"]
);

full(
  ["the model", "the network", "the system"],
  ["learns", "predicts", "finds"],
  ["the patterns", "the next word", "the answer", "the rules"]
);

[
  "artificial intelligence learns patterns from data .",
  "artificial intelligence changes how we work .",
  "the model learns from the data .",
  "language models learn from text .",
  "a neural network is made of simple parts .",
  "the machine learns to spot cats in photos .",
  "training a model takes a lot of data .",
  "the algorithm sorts the list in seconds .",
  "the chatbot answers the question .",
  "the robot builds the cars in the factory .",
  "smart speakers listen for a wake word .",
  "the program follows the instructions .",
  "computers follow instructions very quickly .",
  "a computer stores data as numbers .",
  "the model predicts the next word from context .",
].forEach(add);

full(
  ["she", "he", "the student", "the engineer"],
  ["writes", "tests", "fixes"],
  ["the code", "the program", "the script", "the website"]
);

["we", "they"].forEach((s, i) =>
  ["send", "share", "upload"].forEach((v, j) =>
    ["the photos", "the files", "the videos"].forEach((o, k) =>
      add(`${s} ${v} ${o} ${["on the internet", "to the cloud"][(i + j + k) % 2]} .`)
    )
  )
);

[
  "the wifi at the cafe is slow .",
  "the screen glows in the dark room .",
  "the keyboard clicks in the quiet office .",
  "the email arrives in the folder .",
  "the website loads fast .",
  "the printer works again .",
  "the battery dies before lunch .",
  "the update fixes the bug .",
  "the camera saves the picture .",
  "the search engine finds the answer .",
  "the data moves through the wires .",
  "the password is long and strange .",
  "the app wants my attention .",
  "the game runs on the old machine .",
  "the video call connects the friends .",
  "the code runs without errors .",
  "the server stores the files .",
  "the cloud keeps the photos safe .",
  "the phone rings twice .",
  "technology changes every year .",
].forEach(add);

// ---- general everyday literals ----
[
  "the phone rings twice and then stops .",
  "the clock on the wall runs fast .",
  "the door creaks when the wind blows .",
  "the family eats dinner together .",
  "the family eats dinner in the kitchen .",
  "the baby laughs at the funny sound .",
  "the neighbors are kind and quiet .",
  "the stairs creak on the third step .",
  "the candle burns low in the evening .",
  "the old radio still works .",
  "the garden needs water every evening .",
  "sleep comes easy after a long day .",
  "the market opens early on saturday .",
  "a quiet morning is a small gift .",
  "the small lamp makes the room feel warm .",
  "laughter fills the kitchen in the evening .",
  "the mirror in the hall is very old .",
  "the letter arrives two weeks late .",
  "the keys are in the coat pocket .",
  "the house is quiet after the guests leave .",
  "the kettle sings in the kitchen .",
  "the soup smells like home .",
  "the bread is warm from the oven .",
  "the tea goes cold while we talk .",
  "salt makes the soup taste better .",
  "a good meal needs time and care .",
  "the cheese melts over the warm bread .",
  "the kitchen smells of onions and garlic .",
  "the children eat ice cream in the park .",
  "the children build a fort from old boxes .",
  "the children play in the yard after school .",
  "the fire burns low in the winter night .",
  "the window looks out on the garden .",
  "the curtains move in the soft wind .",
  "the floor creaks under the old rug .",
  "the shelf holds many old books .",
  "the photo album sits on the top shelf .",
  "the calendar still shows last month .",
  "the plants grow fast in the warm room .",
  "the roses bloom along the path .",
  "the grass grows tall by the fence .",
  "the gate swings open in the wind .",
  "the well is deep and cold .",
  "the barn stands at the edge of the field .",
  "the farm wakes early every day .",
  "the horse eats grass near the old barn .",
  "the cow stands quietly in the field .",
  "the sheep stay close to the gate .",
  "the goat climbs onto the rocks .",
  "the duck swims across the quiet pond .",
  "the fish swim slowly in the clear water .",
  "the owl watches the field from a high branch .",
  "the fox crosses the road at night .",
  "the bees buzz around the summer flowers .",
  "the ants march across the warm stone .",
  "the parrot repeats every word we say .",
  "the cat licks its paw and yawns .",
  "the dog waits by the front door .",
  "the dog barks at the mail truck .",
  "the cat watches the rain from the window .",
  "the kitten plays with a ball of wool .",
  "the puppy falls asleep in the basket .",
  "my dog loves long walks in the park .",
  "my cat hates the sound of thunder .",
  "we play cards until late at night .",
  "we watch the stars from the roof .",
  "we clean the whole house on sunday .",
  "we fold the clean clothes together .",
  "we plant a tree for the new year .",
  "we pick berries by the river .",
  "we share a bowl of noodles .",
  "we walk along the harbor at sunset .",
  "we watch the storm from the window .",
  "we take the last train home .",
  "she hums old songs while she cooks .",
  "she plants roses along the path .",
  "she saves a little money every month .",
  "she writes a letter to her old friend .",
  "she teaches math with games and stories .",
  "she moves to a new city for work .",
  "he walks to work when the sun is out .",
  "he fixes the broken chair with glue .",
  "he tells the same joke every year .",
  "he makes pancakes on saturday morning .",
  "he whistles while he waters the plants .",
  "he practices the piano every evening .",
  "her smile makes the long day easier .",
  "his shoes are wet from the rain .",
  "i like tea with a little honey .",
  "i study best in the early morning .",
  "i lose my umbrella on the bus .",
  "good questions matter more than fast answers .",
  "the best part of the day is the quiet morning .",
  "the day ends with a warm meal .",
  "the night is long in december .",
  "the morning starts with hot coffee .",
  "the evening ends with a good book .",
].forEach(add);

export { CORPUS };
