'use strict';
// CONFIG: Replace with your Cloudflare Worker URL
const PROXY_URL = 'https://YOUR-WORKER.YOUR-NAME.workers.dev';


// ═══════════════════════════════════════════════════════════════════════════
// DATA — full spell & feat index for instant search
// ═══════════════════════════════════════════════════════════════════════════
const SPELLS = [
  {n:"Acid Arrow",s:"Conjuration",l:"2",c:"Sor/Wiz 2"},{n:"Acid Fog",s:"Conjuration",l:"6",c:"Sor/Wiz 6"},
  {n:"Air Walk",s:"Transmutation",l:"4",c:"Clr 4, Drd 4"},{n:"Alarm",s:"Abjuration",l:"1",c:"Brd 1, Rgr 1, Sor/Wiz 1"},
  {n:"Animate Dead",s:"Necromancy",l:"3",c:"Clr 3, Sor/Wiz 4"},{n:"Animate Objects",s:"Transmutation",l:"6",c:"Brd 6, Clr 6"},
  {n:"Antilife Shell",s:"Abjuration",l:"6",c:"Clr 6, Drd 6"},{n:"Antimagic Field",s:"Abjuration",l:"6",c:"Clr 8, Sor/Wiz 6"},
  {n:"Antipathy",s:"Enchantment",l:"8",c:"Drd 9, Sor/Wiz 8"},{n:"Arcane Eye",s:"Divination",l:"4",c:"Sor/Wiz 4"},
  {n:"Arcane Lock",s:"Abjuration",l:"2",c:"Sor/Wiz 2"},{n:"Arcane Sight",s:"Divination",l:"3",c:"Sor/Wiz 3"},
  {n:"Astral Projection",s:"Necromancy",l:"9",c:"Clr 9, Sor/Wiz 9"},{n:"Baleful Polymorph",s:"Transmutation",l:"5",c:"Drd 5, Sor/Wiz 5"},
  {n:"Banishment",s:"Abjuration",l:"7",c:"Clr 7, Sor/Wiz 7"},{n:"Bear's Endurance",s:"Transmutation",l:"2",c:"Clr 2, Drd 2, Rgr 2, Sor/Wiz 2"},
  {n:"Binding",s:"Enchantment",l:"8",c:"Sor/Wiz 8"},{n:"Black Tentacles",s:"Conjuration",l:"4",c:"Sor/Wiz 4"},
  {n:"Blade Barrier",s:"Evocation",l:"6",c:"Clr 6"},{n:"Bless",s:"Enchantment",l:"1",c:"Clr 1, Pal 1"},
  {n:"Blight",s:"Necromancy",l:"4",c:"Drd 4, Sor/Wiz 5"},{n:"Blindness/Deafness",s:"Necromancy",l:"2",c:"Brd 2, Clr 3, Sor/Wiz 2"},
  {n:"Blink",s:"Transmutation",l:"3",c:"Sor/Wiz 3"},{n:"Blur",s:"Illusion",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Break Enchantment",s:"Abjuration",l:"5",c:"Brd 4, Clr 5, Pal 4, Sor/Wiz 5"},
  {n:"Bull's Strength",s:"Transmutation",l:"2",c:"Clr 2, Drd 2, Pal 2, Sor/Wiz 2"},
  {n:"Burning Hands",s:"Evocation",l:"1",c:"Sor/Wiz 1"},{n:"Call Lightning",s:"Evocation",l:"3",c:"Drd 3"},
  {n:"Cat's Grace",s:"Transmutation",l:"2",c:"Brd 2, Drd 2, Rgr 2, Sor/Wiz 2"},
  {n:"Cause Fear",s:"Necromancy",l:"1",c:"Brd 1, Clr 1, Sor/Wiz 1"},{n:"Chain Lightning",s:"Evocation",l:"6",c:"Sor/Wiz 6"},
  {n:"Charm Monster",s:"Enchantment",l:"4",c:"Brd 3, Sor/Wiz 4"},{n:"Charm Person",s:"Enchantment",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Circle of Death",s:"Necromancy",l:"6",c:"Sor/Wiz 6"},
  {n:"Clairaudience/Clairvoyance",s:"Divination",l:"3",c:"Brd 3, Clr 3, Sor/Wiz 3"},
  {n:"Cloudkill",s:"Conjuration",l:"5",c:"Sor/Wiz 5"},{n:"Color Spray",s:"Illusion",l:"1",c:"Sor/Wiz 1"},
  {n:"Comprehend Languages",s:"Divination",l:"1",c:"Brd 1, Clr 1, Sor/Wiz 1"},
  {n:"Cone of Cold",s:"Evocation",l:"5",c:"Sor/Wiz 5"},{n:"Confusion",s:"Enchantment",l:"4",c:"Brd 3, Sor/Wiz 4"},
  {n:"Contagion",s:"Necromancy",l:"3",c:"Clr 3, Drd 3"},{n:"Continual Flame",s:"Evocation",l:"2",c:"Clr 3, Sor/Wiz 2"},
  {n:"Control Plants",s:"Transmutation",l:"8",c:"Drd 8"},{n:"Control Undead",s:"Necromancy",l:"7",c:"Sor/Wiz 7"},
  {n:"Control Water",s:"Transmutation",l:"4",c:"Clr 4, Drd 4, Sor/Wiz 6"},
  {n:"Control Weather",s:"Transmutation",l:"7",c:"Clr 7, Drd 7, Sor/Wiz 7"},
  {n:"Control Winds",s:"Transmutation",l:"5",c:"Drd 5, Sor/Wiz 6"},
  {n:"Create Undead",s:"Necromancy",l:"6",c:"Clr 6, Sor/Wiz 6"},
  {n:"Create Greater Undead",s:"Necromancy",l:"8",c:"Clr 8, Sor/Wiz 8"},
  {n:"Cure Critical Wounds",s:"Conjuration",l:"4",c:"Brd 4, Clr 4, Drd 5"},
  {n:"Cure Light Wounds",s:"Conjuration",l:"1",c:"Brd 1, Clr 1, Drd 1, Pal 1, Rgr 2"},
  {n:"Cure Moderate Wounds",s:"Conjuration",l:"2",c:"Brd 2, Clr 2, Drd 3, Pal 3, Rgr 3"},
  {n:"Cure Serious Wounds",s:"Conjuration",l:"3",c:"Brd 3, Clr 3, Drd 4, Pal 4, Rgr 4"},
  {n:"Darkness",s:"Evocation",l:"2",c:"Brd 2, Clr 2, Sor/Wiz 2"},
  {n:"Daylight",s:"Evocation",l:"3",c:"Brd 3, Clr 3, Drd 3, Pal 3, Sor/Wiz 3"},
  {n:"Daze",s:"Enchantment",l:"0",c:"Brd 0, Sor/Wiz 0"},{n:"Daze Monster",s:"Enchantment",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Death Knell",s:"Necromancy",l:"2",c:"Clr 2"},{n:"Death Ward",s:"Necromancy",l:"4",c:"Clr 4, Drd 5, Pal 4"},
  {n:"Deeper Darkness",s:"Evocation",l:"3",c:"Clr 3"},
  {n:"Delay Poison",s:"Conjuration",l:"2",c:"Brd 2, Clr 2, Drd 2, Pal 2, Rgr 1"},
  {n:"Detect Magic",s:"Divination",l:"0",c:"Brd 0, Clr 0, Drd 0, Sor/Wiz 0"},
  {n:"Detect Thoughts",s:"Divination",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Dimension Door",s:"Conjuration",l:"4",c:"Brd 4, Sor/Wiz 4"},
  {n:"Dimensional Anchor",s:"Abjuration",l:"4",c:"Clr 4, Sor/Wiz 4"},
  {n:"Discern Location",s:"Divination",l:"8",c:"Clr 8, Sor/Wiz 8"},
  {n:"Disintegrate",s:"Transmutation",l:"6",c:"Sor/Wiz 6"},
  {n:"Dismissal",s:"Abjuration",l:"4",c:"Clr 4, Sor/Wiz 5"},
  {n:"Dispel Chaos",s:"Abjuration",l:"5",c:"Clr 5, Pal 4"},
  {n:"Dispel Evil",s:"Abjuration",l:"5",c:"Clr 5, Pal 4"},
  {n:"Dispel Good",s:"Abjuration",l:"5",c:"Clr 5"},
  {n:"Dispel Law",s:"Abjuration",l:"5",c:"Clr 5"},
  {n:"Dispel Magic",s:"Abjuration",l:"3",c:"Brd 3, Clr 3, Drd 4, Pal 3, Sor/Wiz 3"},
  {n:"Greater Dispel Magic",s:"Abjuration",l:"6",c:"Brd 5, Clr 6, Drd 6, Sor/Wiz 6"},
  {n:"Displacement",s:"Illusion",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Dominate Animal",s:"Enchantment",l:"3",c:"Drd 3"},
  {n:"Dominate Monster",s:"Enchantment",l:"9",c:"Sor/Wiz 9"},
  {n:"Dominate Person",s:"Enchantment",l:"5",c:"Brd 4, Sor/Wiz 5"},
  {n:"Eagle's Splendor",s:"Transmutation",l:"2",c:"Brd 2, Clr 2, Pal 2, Sor/Wiz 2"},
  {n:"Earthquake",s:"Evocation",l:"8",c:"Clr 8, Drd 8"},
  {n:"Elemental Swarm",s:"Conjuration",l:"9",c:"Drd 9"},
  {n:"Endure Elements",s:"Abjuration",l:"1",c:"Clr 1, Drd 1, Pal 1, Rgr 1, Sor/Wiz 1"},
  {n:"Energy Drain",s:"Necromancy",l:"9",c:"Clr 9, Sor/Wiz 9"},
  {n:"Enervation",s:"Necromancy",l:"4",c:"Sor/Wiz 4"},
  {n:"Enlarge Person",s:"Transmutation",l:"1",c:"Sor/Wiz 1"},
  {n:"Entangle",s:"Transmutation",l:"1",c:"Drd 1, Rgr 1"},
  {n:"Ethereal Jaunt",s:"Transmutation",l:"7",c:"Clr 7, Sor/Wiz 7"},
  {n:"Etherealness",s:"Transmutation",l:"9",c:"Clr 9, Sor/Wiz 9"},
  {n:"Expeditious Retreat",s:"Transmutation",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Fear",s:"Necromancy",l:"4",c:"Brd 3, Sor/Wiz 4"},
  {n:"Feather Fall",s:"Transmutation",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Feeblemind",s:"Enchantment",l:"5",c:"Sor/Wiz 5"},
  {n:"Find the Path",s:"Divination",l:"6",c:"Brd 6, Clr 6, Drd 6"},
  {n:"Finger of Death",s:"Necromancy",l:"7",c:"Drd 8, Sor/Wiz 7"},
  {n:"Fire Shield",s:"Evocation",l:"4",c:"Sor/Wiz 4"},
  {n:"Fire Storm",s:"Evocation",l:"7",c:"Clr 8, Drd 7"},
  {n:"Fireball",s:"Evocation",l:"3",c:"Sor/Wiz 3"},
  {n:"Flame Strike",s:"Evocation",l:"5",c:"Clr 5, Drd 4"},
  {n:"Flaming Sphere",s:"Evocation",l:"2",c:"Drd 2, Sor/Wiz 2"},
  {n:"Flesh to Stone",s:"Transmutation",l:"6",c:"Sor/Wiz 6"},
  {n:"Fly",s:"Transmutation",l:"3",c:"Sor/Wiz 3"},
  {n:"Fog Cloud",s:"Conjuration",l:"2",c:"Drd 2, Sor/Wiz 2"},
  {n:"Forcecage",s:"Evocation",l:"7",c:"Sor/Wiz 7"},
  {n:"Foresight",s:"Divination",l:"9",c:"Drd 9, Sor/Wiz 9"},
  {n:"Fox's Cunning",s:"Transmutation",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Freedom",s:"Abjuration",l:"9",c:"Sor/Wiz 9"},
  {n:"Freedom of Movement",s:"Abjuration",l:"4",c:"Brd 4, Clr 4, Drd 4, Rgr 4"},
  {n:"Gaseous Form",s:"Transmutation",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Gate",s:"Conjuration",l:"9",c:"Clr 9, Sor/Wiz 9"},
  {n:"Geas/Quest",s:"Enchantment",l:"6",c:"Brd 6, Clr 6, Sor/Wiz 6"},
  {n:"Globe of Invulnerability",s:"Abjuration",l:"6",c:"Sor/Wiz 6"},
  {n:"Lesser Globe of Invulnerability",s:"Abjuration",l:"4",c:"Sor/Wiz 4"},
  {n:"Grease",s:"Conjuration",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Guards and Wards",s:"Abjuration",l:"6",c:"Sor/Wiz 6"},
  {n:"Haste",s:"Transmutation",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Heal",s:"Conjuration",l:"6",c:"Clr 6, Drd 7"},
  {n:"Heat Metal",s:"Transmutation",l:"2",c:"Drd 2"},
  {n:"Hideous Laughter",s:"Enchantment",l:"2",c:"Brd 1, Sor/Wiz 2"},
  {n:"Hold Monster",s:"Enchantment",l:"5",c:"Brd 4, Sor/Wiz 5"},
  {n:"Hold Person",s:"Enchantment",l:"2",c:"Brd 2, Clr 2, Sor/Wiz 3"},
  {n:"Holy Aura",s:"Abjuration",l:"8",c:"Clr 8"},
  {n:"Holy Smite",s:"Evocation",l:"4",c:"Clr 4"},
  {n:"Holy Word",s:"Evocation",l:"7",c:"Clr 7"},
  {n:"Horrid Wilting",s:"Necromancy",l:"8",c:"Sor/Wiz 8"},
  {n:"Hypnotic Pattern",s:"Illusion",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Hypnotism",s:"Enchantment",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Ice Storm",s:"Evocation",l:"4",c:"Drd 5, Sor/Wiz 4"},
  {n:"Identify",s:"Divination",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Imprisonment",s:"Abjuration",l:"9",c:"Sor/Wiz 9"},
  {n:"Incendiary Cloud",s:"Conjuration",l:"8",c:"Sor/Wiz 8"},
  {n:"Inflict Critical Wounds",s:"Necromancy",l:"4",c:"Clr 4"},
  {n:"Inflict Light Wounds",s:"Necromancy",l:"1",c:"Clr 1"},
  {n:"Inflict Moderate Wounds",s:"Necromancy",l:"2",c:"Clr 2"},
  {n:"Inflict Serious Wounds",s:"Necromancy",l:"3",c:"Clr 3"},
  {n:"Insanity",s:"Enchantment",l:"7",c:"Sor/Wiz 7"},
  {n:"Insect Plague",s:"Conjuration",l:"5",c:"Clr 5, Drd 5"},
  {n:"Invisibility",s:"Illusion",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Greater Invisibility",s:"Illusion",l:"4",c:"Brd 4, Sor/Wiz 4"},
  {n:"Invisibility Sphere",s:"Illusion",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Iron Body",s:"Transmutation",l:"8",c:"Sor/Wiz 8"},
  {n:"Jump",s:"Transmutation",l:"1",c:"Drd 1, Rgr 1, Sor/Wiz 1"},
  {n:"Knock",s:"Transmutation",l:"2",c:"Sor/Wiz 2"},
  {n:"Levitate",s:"Transmutation",l:"2",c:"Sor/Wiz 2"},
  {n:"Light",s:"Evocation",l:"0",c:"Brd 0, Clr 0, Drd 0, Sor/Wiz 0"},
  {n:"Lightning Bolt",s:"Evocation",l:"3",c:"Sor/Wiz 3"},
  {n:"Limited Wish",s:"Universal",l:"7",c:"Sor/Wiz 7"},
  {n:"Locate Creature",s:"Divination",l:"4",c:"Brd 4, Clr 4, Drd 4, Sor/Wiz 4"},
  {n:"Locate Object",s:"Divination",l:"2",c:"Brd 2, Clr 3, Sor/Wiz 2"},
  {n:"Mage Armor",s:"Conjuration",l:"1",c:"Sor/Wiz 1"},
  {n:"Magic Circle against Evil",s:"Abjuration",l:"3",c:"Clr 3, Pal 3, Sor/Wiz 3"},
  {n:"Magic Circle against Good",s:"Abjuration",l:"3",c:"Clr 3, Sor/Wiz 3"},
  {n:"Magic Circle against Law",s:"Abjuration",l:"3",c:"Clr 3, Sor/Wiz 3"},
  {n:"Magic Circle against Chaos",s:"Abjuration",l:"3",c:"Clr 3, Pal 3, Sor/Wiz 3"},
  {n:"Magic Fang",s:"Transmutation",l:"1",c:"Drd 1, Rgr 1"},
  {n:"Magic Jar",s:"Necromancy",l:"5",c:"Sor/Wiz 5"},
  {n:"Magic Missile",s:"Evocation",l:"1",c:"Sor/Wiz 1"},
  {n:"Magic Mouth",s:"Illusion",l:"2",c:"Brd 1, Sor/Wiz 2"},
  {n:"Magic Weapon",s:"Transmutation",l:"1",c:"Clr 1, Pal 1, Sor/Wiz 1"},
  {n:"Major Image",s:"Illusion",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Mass Charm Monster",s:"Enchantment",l:"8",c:"Brd 6, Sor/Wiz 8"},
  {n:"Mass Cure Critical Wounds",s:"Conjuration",l:"8",c:"Clr 8, Drd 9"},
  {n:"Mass Cure Light Wounds",s:"Conjuration",l:"5",c:"Brd 5, Clr 5, Drd 6"},
  {n:"Mass Cure Moderate Wounds",s:"Conjuration",l:"6",c:"Brd 6, Clr 6, Drd 7"},
  {n:"Mass Cure Serious Wounds",s:"Conjuration",l:"7",c:"Clr 7, Drd 8"},
  {n:"Mass Hold Monster",s:"Enchantment",l:"9",c:"Sor/Wiz 9"},
  {n:"Mass Hold Person",s:"Enchantment",l:"7",c:"Sor/Wiz 7"},
  {n:"Mass Inflict Light Wounds",s:"Necromancy",l:"5",c:"Clr 5"},
  {n:"Mass Suggestion",s:"Enchantment",l:"6",c:"Brd 5, Sor/Wiz 6"},
  {n:"Maze",s:"Conjuration",l:"8",c:"Sor/Wiz 8"},
  {n:"Mending",s:"Transmutation",l:"0",c:"Brd 0, Clr 0, Drd 0, Sor/Wiz 0"},
  {n:"Meteor Swarm",s:"Evocation",l:"9",c:"Sor/Wiz 9"},
  {n:"Mind Blank",s:"Abjuration",l:"8",c:"Sor/Wiz 8"},
  {n:"Minor Image",s:"Illusion",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Miracle",s:"Evocation",l:"9",c:"Clr 9"},
  {n:"Mirror Image",s:"Illusion",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Mislead",s:"Illusion",l:"6",c:"Brd 5, Sor/Wiz 6"},
  {n:"Move Earth",s:"Transmutation",l:"6",c:"Drd 6, Sor/Wiz 6"},
  {n:"Neutralize Poison",s:"Conjuration",l:"3",c:"Brd 4, Clr 4, Drd 3, Pal 4, Rgr 3"},
  {n:"Nightmare",s:"Illusion",l:"5",c:"Brd 5, Sor/Wiz 5"},
  {n:"Nondetection",s:"Abjuration",l:"3",c:"Rgr 4, Sor/Wiz 3"},
  {n:"Obscuring Mist",s:"Conjuration",l:"1",c:"Clr 1, Drd 1, Sor/Wiz 1"},
  {n:"Owl's Wisdom",s:"Transmutation",l:"2",c:"Clr 2, Drd 2, Rgr 2, Sor/Wiz 2"},
  {n:"Passwall",s:"Transmutation",l:"5",c:"Sor/Wiz 5"},
  {n:"Permanency",s:"Universal",l:"5",c:"Sor/Wiz 5"},
  {n:"Phantasmal Killer",s:"Illusion",l:"4",c:"Sor/Wiz 4"},
  {n:"Phantom Steed",s:"Conjuration",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Plane Shift",s:"Conjuration",l:"5",c:"Clr 5, Sor/Wiz 7"},
  {n:"Polymorph",s:"Transmutation",l:"4",c:"Sor/Wiz 4"},
  {n:"Power Word Blind",s:"Enchantment",l:"7",c:"Sor/Wiz 7"},
  {n:"Power Word Kill",s:"Enchantment",l:"9",c:"Sor/Wiz 9"},
  {n:"Power Word Stun",s:"Enchantment",l:"8",c:"Sor/Wiz 8"},
  {n:"Prayer",s:"Enchantment",l:"3",c:"Clr 3, Pal 3"},
  {n:"Protection from Chaos",s:"Abjuration",l:"1",c:"Clr 1, Pal 1, Sor/Wiz 1"},
  {n:"Protection from Energy",s:"Abjuration",l:"3",c:"Clr 3, Drd 3, Rgr 2, Sor/Wiz 3"},
  {n:"Protection from Evil",s:"Abjuration",l:"1",c:"Clr 1, Pal 1, Sor/Wiz 1"},
  {n:"Protection from Good",s:"Abjuration",l:"1",c:"Clr 1, Sor/Wiz 1"},
  {n:"Protection from Law",s:"Abjuration",l:"1",c:"Clr 1, Sor/Wiz 1"},
  {n:"Raise Dead",s:"Conjuration",l:"5",c:"Clr 5"},
  {n:"Ray of Enfeeblement",s:"Necromancy",l:"1",c:"Sor/Wiz 1"},
  {n:"Ray of Exhaustion",s:"Necromancy",l:"3",c:"Sor/Wiz 3"},
  {n:"Ray of Frost",s:"Evocation",l:"0",c:"Sor/Wiz 0"},
  {n:"Read Magic",s:"Divination",l:"0",c:"Brd 0, Clr 0, Drd 0, Pal 1, Rgr 1, Sor/Wiz 0"},
  {n:"Reduce Person",s:"Transmutation",l:"1",c:"Sor/Wiz 1"},
  {n:"Regenerate",s:"Conjuration",l:"7",c:"Clr 7, Drd 9"},
  {n:"Reincarnate",s:"Transmutation",l:"4",c:"Drd 4"},
  {n:"Remove Blindness/Deafness",s:"Conjuration",l:"3",c:"Clr 3, Pal 3"},
  {n:"Remove Curse",s:"Abjuration",l:"3",c:"Brd 3, Clr 3, Pal 3, Sor/Wiz 4"},
  {n:"Remove Disease",s:"Conjuration",l:"3",c:"Clr 3, Drd 3, Rgr 3"},
  {n:"Remove Fear",s:"Abjuration",l:"1",c:"Brd 1, Clr 1"},
  {n:"Remove Paralysis",s:"Conjuration",l:"2",c:"Clr 2, Pal 2"},
  {n:"Repulsion",s:"Abjuration",l:"6",c:"Clr 7, Sor/Wiz 6"},
  {n:"Resistance",s:"Abjuration",l:"0",c:"Brd 0, Clr 0, Drd 0, Pal 1, Sor/Wiz 0"},
  {n:"Restoration",s:"Conjuration",l:"4",c:"Clr 4, Pal 4"},
  {n:"Resurrection",s:"Conjuration",l:"7",c:"Clr 7"},
  {n:"Reverse Gravity",s:"Transmutation",l:"7",c:"Drd 8, Sor/Wiz 7"},
  {n:"Rope Trick",s:"Transmutation",l:"2",c:"Sor/Wiz 2"},
  {n:"Scare",s:"Necromancy",l:"2",c:"Brd 2, Sor/Wiz 2"},
  {n:"Scorching Ray",s:"Evocation",l:"2",c:"Sor/Wiz 2"},
  {n:"Screen",s:"Illusion",l:"8",c:"Sor/Wiz 8"},
  {n:"See Invisibility",s:"Divination",l:"2",c:"Brd 3, Sor/Wiz 2"},
  {n:"Sequester",s:"Abjuration",l:"7",c:"Sor/Wiz 7"},
  {n:"Shapechange",s:"Transmutation",l:"9",c:"Drd 9, Sor/Wiz 9"},
  {n:"Shatter",s:"Evocation",l:"2",c:"Brd 2, Clr 2, Sor/Wiz 2"},
  {n:"Shield",s:"Abjuration",l:"1",c:"Sor/Wiz 1"},
  {n:"Shield of Faith",s:"Abjuration",l:"1",c:"Clr 1"},
  {n:"Silence",s:"Illusion",l:"2",c:"Brd 2, Clr 2"},
  {n:"Silent Image",s:"Illusion",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Simulacrum",s:"Illusion",l:"7",c:"Sor/Wiz 7"},
  {n:"Sleep",s:"Enchantment",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Slow",s:"Transmutation",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Solid Fog",s:"Conjuration",l:"4",c:"Sor/Wiz 4"},
  {n:"Speak with Animals",s:"Divination",l:"1",c:"Brd 3, Drd 1, Rgr 1"},
  {n:"Speak with Dead",s:"Necromancy",l:"3",c:"Clr 3"},
  {n:"Spectral Hand",s:"Necromancy",l:"2",c:"Sor/Wiz 2"},
  {n:"Spell Resistance",s:"Abjuration",l:"5",c:"Clr 5, Drd 6"},
  {n:"Spider Climb",s:"Transmutation",l:"2",c:"Drd 2, Sor/Wiz 2"},
  {n:"Stinking Cloud",s:"Conjuration",l:"3",c:"Sor/Wiz 3"},
  {n:"Stone Shape",s:"Transmutation",l:"3",c:"Clr 3, Drd 3, Sor/Wiz 4"},
  {n:"Stone to Flesh",s:"Transmutation",l:"6",c:"Sor/Wiz 6"},
  {n:"Stoneskin",s:"Abjuration",l:"4",c:"Drd 5, Sor/Wiz 4"},
  {n:"Storm of Vengeance",s:"Conjuration",l:"9",c:"Clr 9, Drd 9"},
  {n:"Suggestion",s:"Enchantment",l:"3",c:"Brd 2, Sor/Wiz 3"},
  {n:"Summon Monster I",s:"Conjuration",l:"1",c:"Brd 1, Clr 1, Sor/Wiz 1"},
  {n:"Summon Monster II",s:"Conjuration",l:"2",c:"Brd 2, Clr 2, Sor/Wiz 2"},
  {n:"Summon Monster III",s:"Conjuration",l:"3",c:"Brd 3, Clr 3, Sor/Wiz 3"},
  {n:"Summon Monster IV",s:"Conjuration",l:"4",c:"Brd 4, Clr 4, Sor/Wiz 4"},
  {n:"Summon Monster V",s:"Conjuration",l:"5",c:"Brd 5, Clr 5, Sor/Wiz 5"},
  {n:"Summon Monster VI",s:"Conjuration",l:"6",c:"Brd 6, Clr 6, Sor/Wiz 6"},
  {n:"Summon Monster VII",s:"Conjuration",l:"7",c:"Clr 7, Sor/Wiz 7"},
  {n:"Summon Monster VIII",s:"Conjuration",l:"8",c:"Clr 8, Sor/Wiz 8"},
  {n:"Summon Monster IX",s:"Conjuration",l:"9",c:"Clr 9, Sor/Wiz 9"},
  {n:"Summon Nature's Ally I",s:"Conjuration",l:"1",c:"Drd 1, Rgr 1"},
  {n:"Summon Nature's Ally II",s:"Conjuration",l:"2",c:"Drd 2, Rgr 2"},
  {n:"Summon Nature's Ally III",s:"Conjuration",l:"3",c:"Drd 3, Rgr 3"},
  {n:"Summon Nature's Ally IV",s:"Conjuration",l:"4",c:"Drd 4, Rgr 4"},
  {n:"Summon Nature's Ally V",s:"Conjuration",l:"5",c:"Drd 5"},
  {n:"Summon Nature's Ally VI",s:"Conjuration",l:"6",c:"Drd 6"},
  {n:"Summon Nature's Ally VII",s:"Conjuration",l:"7",c:"Drd 7"},
  {n:"Summon Nature's Ally VIII",s:"Conjuration",l:"8",c:"Drd 8"},
  {n:"Summon Nature's Ally IX",s:"Conjuration",l:"9",c:"Drd 9"},
  {n:"Sunbeam",s:"Evocation",l:"7",c:"Drd 7"},
  {n:"Sunburst",s:"Evocation",l:"8",c:"Drd 8, Sor/Wiz 8"},
  {n:"Symbol of Death",s:"Necromancy",l:"8",c:"Clr 8, Sor/Wiz 8"},
  {n:"Symbol of Fear",s:"Necromancy",l:"6",c:"Clr 6, Sor/Wiz 6"},
  {n:"Symbol of Insanity",s:"Enchantment",l:"8",c:"Clr 8, Sor/Wiz 8"},
  {n:"Symbol of Pain",s:"Necromancy",l:"5",c:"Clr 5, Sor/Wiz 5"},
  {n:"Symbol of Sleep",s:"Enchantment",l:"5",c:"Clr 5, Sor/Wiz 5"},
  {n:"Symbol of Stunning",s:"Enchantment",l:"7",c:"Clr 7, Sor/Wiz 7"},
  {n:"Symbol of Weakness",s:"Necromancy",l:"7",c:"Clr 7, Sor/Wiz 7"},
  {n:"Sympathy",s:"Enchantment",l:"8",c:"Drd 9, Sor/Wiz 8"},
  {n:"Telekinesis",s:"Transmutation",l:"5",c:"Sor/Wiz 5"},
  {n:"Telepathic Bond",s:"Divination",l:"5",c:"Sor/Wiz 5"},
  {n:"Teleport",s:"Conjuration",l:"5",c:"Sor/Wiz 5"},
  {n:"Greater Teleport",s:"Conjuration",l:"7",c:"Sor/Wiz 7"},
  {n:"Teleportation Circle",s:"Conjuration",l:"9",c:"Sor/Wiz 9"},
  {n:"Time Stop",s:"Transmutation",l:"9",c:"Sor/Wiz 9"},
  {n:"Tiny Hut",s:"Evocation",l:"3",c:"Brd 3, Sor/Wiz 3"},
  {n:"Tongues",s:"Divination",l:"3",c:"Brd 2, Clr 4, Sor/Wiz 3"},
  {n:"Trap the Soul",s:"Conjuration",l:"8",c:"Sor/Wiz 8"},
  {n:"True Resurrection",s:"Conjuration",l:"9",c:"Clr 9"},
  {n:"True Seeing",s:"Divination",l:"5",c:"Clr 5, Drd 7, Sor/Wiz 6"},
  {n:"True Strike",s:"Divination",l:"1",c:"Sor/Wiz 1"},
  {n:"Vampiric Touch",s:"Necromancy",l:"3",c:"Sor/Wiz 3"},
  {n:"Veil",s:"Illusion",l:"6",c:"Brd 6, Sor/Wiz 6"},
  {n:"Ventriloquism",s:"Illusion",l:"1",c:"Brd 1, Sor/Wiz 1"},
  {n:"Wail of the Banshee",s:"Necromancy",l:"9",c:"Sor/Wiz 9"},
  {n:"Wall of Fire",s:"Evocation",l:"4",c:"Drd 5, Sor/Wiz 4"},
  {n:"Wall of Force",s:"Evocation",l:"5",c:"Sor/Wiz 5"},
  {n:"Wall of Ice",s:"Evocation",l:"4",c:"Sor/Wiz 4"},
  {n:"Wall of Stone",s:"Conjuration",l:"5",c:"Clr 5, Drd 6, Sor/Wiz 5"},
  {n:"Wall of Thorns",s:"Conjuration",l:"5",c:"Drd 5"},
  {n:"Water Breathing",s:"Transmutation",l:"3",c:"Clr 3, Drd 3, Sor/Wiz 3"},
  {n:"Web",s:"Conjuration",l:"2",c:"Sor/Wiz 2"},
  {n:"Weird",s:"Illusion",l:"9",c:"Sor/Wiz 9"},
  {n:"Whirlwind",s:"Evocation",l:"8",c:"Drd 8, Sor/Wiz 8"},
  {n:"Wish",s:"Universal",l:"9",c:"Sor/Wiz 9"},
  {n:"Word of Chaos",s:"Evocation",l:"7",c:"Clr 7"},
  {n:"Word of Recall",s:"Conjuration",l:"6",c:"Clr 6, Drd 8"},
  {n:"Zone of Truth",s:"Enchantment",l:"2",c:"Clr 2, Pal 2"},
];

const FEATS = [
  {n:"Acrobatic",t:"General",p:"—"},{n:"Acrobatic Steps",t:"General",p:"Nimble Moves, Acrobatics 7 ranks"},
  {n:"Agile Maneuvers",t:"Combat",p:"—"},{n:"Alertness",t:"General",p:"—"},
  {n:"Alignment Channel",t:"General",p:"Channel energy class feature"},
  {n:"Animal Affinity",t:"General",p:"—"},
  {n:"Arcane Armor Mastery",t:"Combat",p:"Arcane Armor Training, Med. Armor Prof., arcane spellcaster 7"},
  {n:"Arcane Armor Training",t:"Combat",p:"Light Armor Prof., arcane spellcaster 3"},
  {n:"Arcane Strike",t:"Combat",p:"Ability to cast arcane spells"},
  {n:"Athletic",t:"General",p:"—"},{n:"Augment Summoning",t:"General",p:"Spell Focus (conjuration)"},
  {n:"Bleeding Critical",t:"Combat",p:"Critical Focus, BAB +11"},
  {n:"Blind-Fight",t:"Combat",p:"—"},{n:"Blinding Critical",t:"Combat",p:"Critical Focus, BAB +15"},
  {n:"Catch Off-Guard",t:"Combat",p:"—"},{n:"Channel Smite",t:"Combat",p:"Channel energy class feature"},
  {n:"Cleave",t:"Combat",p:"Str 13, Power Attack, BAB +1"},
  {n:"Great Cleave",t:"Combat",p:"Str 13, Cleave, Power Attack, BAB +4"},
  {n:"Combat Casting",t:"General",p:"—"},{n:"Combat Expertise",t:"Combat",p:"Int 13"},
  {n:"Improved Disarm",t:"Combat",p:"Int 13, Combat Expertise"},
  {n:"Greater Disarm",t:"Combat",p:"Combat Expertise, Improved Disarm, BAB +6"},
  {n:"Improved Feint",t:"Combat",p:"Int 13, Combat Expertise"},
  {n:"Greater Feint",t:"Combat",p:"Combat Expertise, Improved Feint, BAB +6"},
  {n:"Improved Trip",t:"Combat",p:"Int 13, Combat Expertise"},
  {n:"Greater Trip",t:"Combat",p:"Combat Expertise, Improved Trip, BAB +6"},
  {n:"Whirlwind Attack",t:"Combat",p:"Dex 13, Int 13, Combat Expertise, Dodge, Mobility, Spring Attack, BAB +4"},
  {n:"Combat Reflexes",t:"Combat",p:"—"},{n:"Command Undead",t:"General",p:"Channel negative energy"},
  {n:"Critical Focus",t:"Combat",p:"BAB +9"},
  {n:"Stunning Critical",t:"Combat",p:"Critical Focus, Staggering Critical, BAB +17"},
  {n:"Staggering Critical",t:"Combat",p:"Critical Focus, BAB +13"},
  {n:"Tiring Critical",t:"Combat",p:"Critical Focus, BAB +13"},
  {n:"Deadly Aim",t:"Combat",p:"Dex 13, BAB +1"},
  {n:"Deadly Stroke",t:"Combat",p:"Dazzling Display, Greater Weapon Focus, Shatter Defenses, Weapon Focus, BAB +11"},
  {n:"Dazzling Display",t:"Combat",p:"Weapon Focus"},{n:"Deceitful",t:"General",p:"—"},
  {n:"Defensive Combat Training",t:"Combat",p:"—"},
  {n:"Deflect Arrows",t:"Combat",p:"Dex 13, Improved Unarmed Strike"},
  {n:"Snatch Arrows",t:"Combat",p:"Dex 15, Deflect Arrows, Improved Unarmed Strike"},
  {n:"Deft Hands",t:"General",p:"—"},{n:"Disruptive",t:"Combat",p:"6th-level fighter"},
  {n:"Spellbreaker",t:"Combat",p:"Disruptive, 10th-level fighter"},
  {n:"Dodge",t:"Combat",p:"Dex 13"},{n:"Mobility",t:"Combat",p:"Dex 13, Dodge"},
  {n:"Spring Attack",t:"Combat",p:"Dex 13, Dodge, Mobility, BAB +4"},
  {n:"Double Slice",t:"Combat",p:"Dex 15, Two-Weapon Fighting"},
  {n:"Elemental Channel",t:"General",p:"Channel energy class feature"},
  {n:"Endurance",t:"General",p:"—"},{n:"Diehard",t:"General",p:"Endurance"},
  {n:"Eschew Materials",t:"General",p:"—"},{n:"Extra Channel",t:"General",p:"Channel energy class feature"},
  {n:"Extra Ki",t:"General",p:"Ki pool class feature"},{n:"Extra Lay On Hands",t:"General",p:"Lay on hands class feature"},
  {n:"Extra Mercy",t:"General",p:"Mercy class feature, lay on hands"},
  {n:"Extra Performance",t:"General",p:"Bardic performance class feature"},
  {n:"Extra Rage",t:"General",p:"Rage class feature"},
  {n:"Far Shot",t:"Combat",p:"Point-Blank Shot"},{n:"Fleet",t:"General",p:"—"},
  {n:"Furious Focus",t:"Combat",p:"Str 13, Power Attack, BAB +1"},
  {n:"Great Fortitude",t:"General",p:"—"},{n:"Improved Great Fortitude",t:"General",p:"Great Fortitude"},
  {n:"Greater Bull Rush",t:"Combat",p:"Improved Bull Rush, Power Attack, BAB +6"},
  {n:"Greater Overrun",t:"Combat",p:"Improved Overrun, Power Attack, BAB +6"},
  {n:"Greater Spell Focus",t:"General",p:"Spell Focus"},{n:"Greater Spell Penetration",t:"General",p:"Spell Penetration"},
  {n:"Greater Two-Weapon Fighting",t:"Combat",p:"Dex 19, Improved TWF, TWF, BAB +11"},
  {n:"Greater Vital Strike",t:"Combat",p:"Improved Vital Strike, Vital Strike, BAB +16"},
  {n:"Greater Weapon Focus",t:"Combat",p:"Weapon Focus, 8th-level fighter"},
  {n:"Greater Weapon Specialization",t:"Combat",p:"Greater Weapon Focus, Weapon Specialization, 12th-level fighter"},
  {n:"Improved Bull Rush",t:"Combat",p:"Str 13, Power Attack, BAB +1"},
  {n:"Improved Channel",t:"General",p:"Channel energy class feature"},
  {n:"Improved Counterspell",t:"General",p:"—"},
  {n:"Improved Critical",t:"Combat",p:"Proficiency with weapon, BAB +8"},
  {n:"Improved Familiar",t:"General",p:"Ability to acquire a new familiar"},
  {n:"Improved Grapple",t:"Combat",p:"Dex 13, Improved Unarmed Strike"},
  {n:"Greater Grapple",t:"Combat",p:"Improved Grapple, Improved Unarmed Strike, BAB +6"},
  {n:"Improved Initiative",t:"Combat",p:"—"},
  {n:"Improved Overrun",t:"Combat",p:"Str 13, Power Attack, BAB +1"},
  {n:"Improved Precise Shot",t:"Combat",p:"Dex 19, Point-Blank Shot, Precise Shot, BAB +11"},
  {n:"Improved Shield Bash",t:"Combat",p:"Shield Proficiency"},
  {n:"Improved Sunder",t:"Combat",p:"Str 13, Power Attack, BAB +1"},
  {n:"Greater Sunder",t:"Combat",p:"Improved Sunder, Power Attack, BAB +6"},
  {n:"Improved Two-Weapon Fighting",t:"Combat",p:"Dex 17, Two-Weapon Fighting, BAB +6"},
  {n:"Improved Unarmed Strike",t:"Combat",p:"—"},{n:"Intimidating Prowess",t:"Combat",p:"—"},
  {n:"Iron Will",t:"General",p:"—"},{n:"Improved Iron Will",t:"General",p:"Iron Will"},
  {n:"Leadership",t:"General",p:"Character level 7"},{n:"Lightning Reflexes",t:"General",p:"—"},
  {n:"Improved Lightning Reflexes",t:"General",p:"Lightning Reflexes"},
  {n:"Lunge",t:"Combat",p:"BAB +6"},{n:"Magical Aptitude",t:"General",p:"—"},
  {n:"Manyshot",t:"Combat",p:"Dex 17, Point-Blank Shot, Rapid Shot, BAB +6"},
  {n:"Master Craftsman",t:"General",p:"5 ranks in any Craft or Profession"},
  {n:"Mounted Archery",t:"Combat",p:"Ride 1 rank, Mounted Combat"},
  {n:"Mounted Combat",t:"Combat",p:"Ride 1 rank"},{n:"Ride-By Attack",t:"Combat",p:"Ride 1 rank, Mounted Combat"},
  {n:"Spirited Charge",t:"Combat",p:"Ride 1 rank, Mounted Combat, Ride-By Attack"},
  {n:"Trample",t:"Combat",p:"Ride 1 rank, Mounted Combat"},
  {n:"Natural Spell",t:"General",p:"Wis 13, wild shape class feature"},
  {n:"Nimble Moves",t:"General",p:"Dex 13"},{n:"Persuasive",t:"General",p:"—"},
  {n:"Point-Blank Shot",t:"Combat",p:"—"},{n:"Precise Shot",t:"Combat",p:"Point-Blank Shot"},
  {n:"Power Attack",t:"Combat",p:"Str 13, BAB +1"},{n:"Quick Draw",t:"Combat",p:"BAB +1"},
  {n:"Quicken Spell",t:"Metamagic",p:"—"},{n:"Rapid Reload",t:"Combat",p:"Weapon Proficiency (crossbow)"},
  {n:"Rapid Shot",t:"Combat",p:"Dex 13, Point-Blank Shot"},{n:"Run",t:"General",p:"—"},
  {n:"Scorpion Style",t:"Combat",p:"Improved Unarmed Strike"},
  {n:"Selective Channeling",t:"General",p:"Cha 13, channel energy class feature"},
  {n:"Self-Sufficient",t:"General",p:"—"},
  {n:"Shatter Defenses",t:"Combat",p:"Weapon Focus, Dazzling Display, BAB +6"},
  {n:"Shield Focus",t:"Combat",p:"Shield Proficiency, BAB +1"},
  {n:"Greater Shield Focus",t:"Combat",p:"Shield Focus, Shield Proficiency, 8th-level fighter"},
  {n:"Shield Master",t:"Combat",p:"Improved Shield Bash, Shield Slam, TWF, BAB +11"},
  {n:"Shield Proficiency",t:"Combat",p:"—"},{n:"Tower Shield Proficiency",t:"Combat",p:"Shield Proficiency"},
  {n:"Shield Slam",t:"Combat",p:"Improved Shield Bash, Shield Proficiency, TWF, BAB +6"},
  {n:"Shot on the Run",t:"Combat",p:"Dex 13, Dodge, Mobility, Point-Blank Shot, BAB +4"},
  {n:"Skill Focus",t:"General",p:"—"},{n:"Spell Focus",t:"General",p:"—"},
  {n:"Spell Mastery",t:"General",p:"1st-level wizard"},{n:"Spell Penetration",t:"General",p:"—"},
  {n:"Stealthy",t:"General",p:"—"},{n:"Step Up",t:"Combat",p:"BAB +1"},
  {n:"Following Step",t:"Combat",p:"Dex 13, Step Up, BAB +6"},
  {n:"Step Up and Strike",t:"Combat",p:"Dex 13, Following Step, Step Up, BAB +11"},
  {n:"Strike Back",t:"Combat",p:"BAB +11"},
  {n:"Stunning Fist",t:"Combat",p:"Dex 13, Wis 13, Improved Unarmed Strike, BAB +8"},
  {n:"Throw Anything",t:"Combat",p:"—"},{n:"Toughness",t:"General",p:"—"},
  {n:"Turn Undead",t:"General",p:"Channel positive energy class feature"},
  {n:"Two-Weapon Defense",t:"Combat",p:"Dex 15, Two-Weapon Fighting"},
  {n:"Two-Weapon Fighting",t:"Combat",p:"Dex 15"},
  {n:"Two-Weapon Rend",t:"Combat",p:"Dex 17, Double Slice, Improved TWF, TWF, BAB +11"},
  {n:"Vital Strike",t:"Combat",p:"BAB +6"},{n:"Improved Vital Strike",t:"Combat",p:"Vital Strike, BAB +11"},
  {n:"Weapon Finesse",t:"Combat",p:"—"},{n:"Weapon Focus",t:"Combat",p:"Proficiency with weapon, BAB +1"},
  {n:"Weapon Specialization",t:"Combat",p:"Greater Weapon Focus, Weapon Focus, 4th-level fighter"},
  {n:"Wind Stance",t:"Combat",p:"Dex 15, Dodge, BAB +6"},
  {n:"Lightning Stance",t:"Combat",p:"Dex 17, Dodge, Wind Stance, BAB +11"},
  {n:"Empower Spell",t:"Metamagic",p:"—"},{n:"Enlarge Spell",t:"Metamagic",p:"—"},
  {n:"Extend Spell",t:"Metamagic",p:"—"},{n:"Heighten Spell",t:"Metamagic",p:"—"},
  {n:"Maximize Spell",t:"Metamagic",p:"—"},{n:"Reach Spell",t:"Metamagic",p:"—"},
  {n:"Selective Spell",t:"Metamagic",p:"Spellcraft 10 ranks"},
  {n:"Silent Spell",t:"Metamagic",p:"—"},{n:"Still Spell",t:"Metamagic",p:"—"},
  {n:"Widen Spell",t:"Metamagic",p:"—"},
];

const CLASSES = [
  "Alchemist","Antipaladin","Arcanist","Barbarian","Bard","Bloodrager","Brawler",
  "Cavalier","Cleric","Druid","Fighter","Gunslinger","Hunter","Inquisitor",
  "Investigator","Magus","Monk","Ninja","Oracle","Paladin","Ranger","Rogue",
  "Samurai","Shaman","Shifter","Skald","Slayer","Sorcerer","Summoner",
  "Swashbuckler","Vigilante","Warpriest","Witch","Wizard",
];

// ═══════════════════════════════════════════════════════════════════════════
// INDEXEDDB — persistent entry cache
// ═══════════════════════════════════════════════════════════════════════════
const DB_NAME = 'pf-companion', DB_VER = 1, STORE = 'entries';
let db = null;

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = e => { db = e.target.result; res(db); };
    req.onerror = () => rej(req.error);
  });
}
function dbGet(id) {
  return new Promise(res => {
    if (!db) return res(null);
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
    req.onsuccess = () => res(req.result?.html || null);
    req.onerror = () => res(null);
  });
}
function dbSet(id, html) {
  if (!db) return;
  db.transaction(STORE, 'readwrite').objectStore(STORE).put({ id, html, ts: Date.now() });
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════
const SK = 'pfc_v6';
const TYPES = ['Spell','Feat','Class','Item','Monster'];

let S = { chars:[], activeChar:null, bookmarks:{}, typeFilter:null, results:[], activeEntry:null };

function saveState() {
  try { localStorage.setItem(SK, JSON.stringify({ chars:S.chars, activeChar:S.activeChar, bookmarks:S.bookmarks })); } catch(e) {}
}
function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem(SK) || '{}');
    S.chars = d.chars || [];
    S.activeChar = d.activeChar || null;
    S.bookmarks = d.bookmarks || {};
    if (S.activeChar && !S.chars.find(c => c.id === S.activeChar))
      S.activeChar = S.chars[0]?.id || null;
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// URL HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function aonUrl(name, type) {
  const m = { Spell:'SpellDisplay', Feat:'FeatDisplay', Class:'ClassDisplay', Item:'MagicItemsDisplay', Monster:'MonsterDisplay' };
  return `https://www.aonprd.com/${m[type]||'Search'}.aspx?ItemName=${encodeURIComponent(name)}`;
}
function pfUrl(name, type) {
  const m = { Spell:'magic/all-spells', Feat:'feats', Class:'classes/core-classes', Item:'magic-items', Monster:'gamemastering/monsters-foes' };
  const slug = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  return `https://www.d20pfsrd.com/${m[type]||''}/${slug}/`;
}
function entryId(name, type) { return `${type}:${name}`; }
function esc(s='') { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function typeCls(t) { return 'tb-' + t.toLowerCase(); }

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════════════════════
function doSearch() {
  const raw = document.getElementById('search-input').value.trim();
  if (!raw) return;
  const lq = raw.toLowerCase(), tf = S.typeFilter;
  const results = [];

  if (!tf || tf === 'Spell')
    SPELLS.filter(s => s.n.toLowerCase().includes(lq)).slice(0,25)
      .forEach(s => results.push({ id:entryId(s.n,'Spell'), name:s.n, type:'Spell', meta:s.s+(s.l?' · Lvl '+s.l:'') }));

  if (!tf || tf === 'Feat')
    FEATS.filter(f => f.n.toLowerCase().includes(lq)).slice(0,25)
      .forEach(f => results.push({ id:entryId(f.n,'Feat'), name:f.n, type:'Feat', meta:f.t }));

  if (!tf || tf === 'Class')
    CLASSES.filter(c => c.toLowerCase().includes(lq)).slice(0,10)
      .forEach(c => results.push({ id:entryId(c,'Class'), name:c, type:'Class', meta:'Class' }));

  ['Item','Monster'].forEach(t => {
    if (!tf || tf === t)
      results.push({ id:entryId(raw,t), name:raw, type:t, meta:'AI lookup' });
  });

  results.sort((a,b) => {
    const [al,bl] = [a.name.toLowerCase(), b.name.toLowerCase()];
    if (al===lq && bl!==lq) return -1; if (al!==lq && bl===lq) return 1;
    if (al.startsWith(lq) && !bl.startsWith(lq)) return -1;
    if (!al.startsWith(lq) && bl.startsWith(lq)) return 1;
    return al.localeCompare(bl);
  });

  S.results = results.slice(0, 50);
  renderResults();
}

// ═══════════════════════════════════════════════════════════════════════════
// PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════
function buildPrompt(entry) {
  const aon = aonUrl(entry.name, entry.type);
  const pf  = pfUrl(entry.name, entry.type);
  const src = `<div class="source-note">Pathfinder 1E · <a href="${aon}" target="_blank">Archives of Nethys</a> · <a href="${pf}" target="_blank">d20pfsrd</a></div>`;

  const T = {
    Spell: `You are a Pathfinder 1E rules expert. Render the COMPLETE spell entry for "${entry.name}".
Output ONLY raw HTML — no markdown fences, no preamble, nothing outside the div.
Use exactly this structure:
<div class="stat-block">
<h1>${entry.name}</h1>
<div class="tag-row"><span class="tag t-spell">[School]</span></div>
<div class="stat-line">
  <div class="stat-kv"><span class="stat-k">School</span><span class="stat-v">[school + subschool + descriptor]</span></div>
  <div class="stat-kv"><span class="stat-k">Level</span><span class="stat-v">[all class levels]</span></div>
</div>
<div class="stat-line">
  <div class="stat-kv"><span class="stat-k">Casting Time</span><span class="stat-v">[time]</span></div>
  <div class="stat-kv"><span class="stat-k">Components</span><span class="stat-v">[components with material descriptions]</span></div>
</div>
<div class="stat-line">
  <div class="stat-kv"><span class="stat-k">Range</span><span class="stat-v">[range]</span></div>
  <div class="stat-kv"><span class="stat-k">Target/Area</span><span class="stat-v">[target or area]</span></div>
  <div class="stat-kv"><span class="stat-k">Duration</span><span class="stat-v">[duration]</span></div>
  <div class="stat-kv"><span class="stat-k">Saving Throw</span><span class="stat-v">[save]</span></div>
  <div class="stat-kv"><span class="stat-k">Spell Resistance</span><span class="stat-v">[yes/no]</span></div>
</div>
<h2>Description</h2>
[full <p> paragraphs with all mechanics, damage dice, special rules]
${src}</div>`,

    Feat: `You are a Pathfinder 1E rules expert. Render the COMPLETE feat entry for "${entry.name}".
Output ONLY raw HTML — no markdown fences, no preamble.
<div class="stat-block">
<h1>${entry.name}</h1>
<div class="tag-row"><span class="tag t-feat">[Feat Type]</span></div>
<div class="stat-line">
  <div class="stat-kv"><span class="stat-k">Prerequisites</span><span class="stat-v">[full prerequisites or None]</span></div>
</div>
<h2>Benefit</h2><p>[Full benefit with all mechanical details]</p>
[<h2>Normal</h2><p>...</p> only if a Normal entry exists]
[<h2>Special</h2><p>...</p> only if a Special entry exists]
${src}</div>`,

    Class: `You are a Pathfinder 1E rules expert. Render the COMPLETE class entry for "${entry.name}".
Output ONLY raw HTML using .stat-block — no markdown fences.
Include: Role, alignment, hit die, class skills, skill ranks/level, BAB progression, save progressions, armor/weapon proficiencies, then ALL class features with full text for every level.
Use h2 for major sections, stat-line/stat-kv for stat rows, p tags for descriptions.
End with: ${src}`,

    Item: `You are a Pathfinder 1E rules expert. Render the COMPLETE magic item entry for "${entry.name}".
Output ONLY raw HTML using .stat-block — no markdown fences.
Include: Aura strength and school, CL, slot, price, weight, full description with all abilities, Craft prerequisites and cost.
End with: ${src}`,

    Monster: `You are a Pathfinder 1E rules expert. Render the COMPLETE monster stat block for "${entry.name}".
Output ONLY raw HTML using .stat-block — no markdown fences.
Include in order: CR/XP, alignment/size/type, Init/Senses, AC (touch, flat-footed, bonuses), HP/HD, Fort/Ref/Will, Speed, all attacks with full bonuses and damage, Space/Reach, Special Attacks, Spell-Like Abilities if any, then Str/Dex/Con/Int/Wis/Cha, Base Atk/CMB/CMD, Feats, Skills (with racial modifiers), Languages, Special Qualities, Environment/Organization/Treasure, Description.
Use stat-line/stat-kv for stat rows, h2 for Offense/Defense/Statistics/Ecology sections, p for descriptions.
End with: ${src}`,
  };

  return T[entry.type] || `Render a complete Pathfinder 1E entry for "${entry.name}" (${entry.type}) as raw HTML using .stat-block. End with ${src}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// STREAMING API CALL
// ═══════════════════════════════════════════════════════════════════════════
async function streamEntry(entry, contentEl) {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-2.5-flash',
      max_tokens: 1500,
      system: 'You are a Pathfinder 1E rules expert. Output ONLY raw HTML. Never use markdown code fences. Never output any text before or after the HTML div.',
      messages: [{ role: 'user', content: buildPrompt(entry) }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '', html = '';

  contentEl.innerHTML = '<div class="stat-block stream-cursor" id="stream-target"></div>';
  const target = document.getElementById('stream-target');
  const scroll = contentEl.closest('.entry-scroll') || contentEl;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const evt = JSON.parse(data);
        // Gemini SSE format: candidates[0].content.parts[0].text
        const chunk = evt?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) {
          html += chunk;
          const clean = html.replace(/^```html?\s*/i, '').replace(/```\s*$/, '');
          target.innerHTML = clean;
          scroll.scrollTop = scroll.scrollHeight;
        }
      } catch(e) { /* skip malformed SSE lines */ }
    }
  }

  target.classList.remove('stream-cursor');
  const finalHtml = html.replace(/^```html?\s*/i, '').replace(/```\s*$/, '').trim();
  contentEl.innerHTML = finalHtml;
  return finalHtml;
}

// ═══════════════════════════════════════════════════════════════════════════
// OPEN ENTRY
// ═══════════════════════════════════════════════════════════════════════════
async function openEntry(entry) {
  S.activeEntry = entry;

  document.getElementById('welcome').style.display = 'none';
  document.getElementById('entry-view').style.display = 'flex';
  document.getElementById('entry-title').textContent = entry.name;
  document.getElementById('entry-subtitle').textContent = entry.meta || entry.type;
  document.getElementById('aon-link').href = aonUrl(entry.name, entry.type);
  document.getElementById('pfsrd-link').href = pfUrl(entry.name, entry.type);
  document.getElementById('entry-scroll').scrollTop = 0;

  updateBMBtn();
  renderResults();
  renderBookmarks();

  const content = contentEl();
  const badge = document.getElementById('cache-badge');

  // Try cache first
  const cached = await dbGet(entry.id);
  if (cached) {
    badge.style.display = 'inline';
    content.innerHTML = cached;
    return;
  }

  badge.style.display = 'none';
  content.innerHTML = '<div class="loading-wrap"><div class="spinner"></div><div class="loading-msg">Consulting the Archives…</div></div>';

  try {
    const html = await streamEntry(entry, content);
    dbSet(entry.id, html);
  } catch(e) {
    content.innerHTML = `<div class="error-box">
      <strong>Could not load entry.</strong><br>${esc(e.message)}<br><br>
      Try <a href="${aonUrl(entry.name, entry.type)}" target="_blank">Archives of Nethys</a>
      or <a href="${pfUrl(entry.name, entry.type)}" target="_blank">d20pfsrd</a> directly.
    </div>`;
  }
}

function contentEl() { return document.getElementById('entry-content'); }

// ═══════════════════════════════════════════════════════════════════════════
// BOOKMARKS
// ═══════════════════════════════════════════════════════════════════════════
function activeBMs()       { return S.activeChar ? (S.bookmarks[S.activeChar] || []) : []; }
function isBookmarked(id)  { return activeBMs().some(b => b.id === id); }

function toggleBookmark() {
  if (!S.activeChar) { alert('Create a character first!'); return; }
  if (!S.activeEntry) return;
  const e = S.activeEntry, bms = activeBMs();
  const idx = bms.findIndex(b => b.id === e.id);
  if (idx >= 0) bms.splice(idx, 1);
  else bms.push({ id:e.id, name:e.name, type:e.type, meta:e.meta||'' });
  S.bookmarks[S.activeChar] = bms;
  saveState(); updateBMBtn(); renderBookmarks(); renderResults();
}

function quickBM(id, name, type, meta) {
  if (!S.activeChar) { alert('Create a character first!'); return; }
  const bms = activeBMs();
  const idx = bms.findIndex(b => b.id === id);
  if (idx >= 0) bms.splice(idx, 1);
  else bms.push({ id, name, type, meta });
  S.bookmarks[S.activeChar] = bms;
  saveState(); renderBookmarks(); renderResults();
}

function removeBM(id) {
  if (!S.activeChar) return;
  S.bookmarks[S.activeChar] = activeBMs().filter(b => b.id !== id);
  saveState(); renderBookmarks();
  if (S.activeEntry?.id === id) updateBMBtn();
}

function updateBMBtn() {
  const btn = document.getElementById('bm-btn');
  const on  = S.activeEntry && isBookmarked(S.activeEntry.id);
  btn.textContent = on ? '★ Bookmarked' : '☆ Bookmark';
  btn.classList.toggle('on', !!on);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHARACTERS
// ═══════════════════════════════════════════════════════════════════════════
function selectChar(id) {
  S.activeChar = id; saveState();
  renderCharStrip(); renderBookmarks(); updateBMBtn();
}
function openNewChar() {
  document.getElementById('nc-overlay').classList.add('open');
  document.getElementById('nc-input').value = '';
  setTimeout(() => document.getElementById('nc-input').focus(), 50);
}
function closeNewChar() { document.getElementById('nc-overlay').classList.remove('open'); }
function confirmNewChar() {
  const name = document.getElementById('nc-input').value.trim();
  if (!name) return;
  const id = 'c' + Date.now();
  S.chars.push({ id, name });
  S.bookmarks[id] = [];
  S.activeChar = id;
  saveState(); closeNewChar(); renderCharStrip(); renderBookmarks();
}
function deleteChar(id) {
  if (!confirm('Remove this character and all their bookmarks?')) return;
  S.chars = S.chars.filter(c => c.id !== id);
  delete S.bookmarks[id];
  if (S.activeChar === id) S.activeChar = S.chars[0]?.id || null;
  saveState(); renderCharStrip(); renderBookmarks();
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
function renderCharStrip() {
  const strip = document.getElementById('char-strip');
  strip.innerHTML = '';
  S.chars.forEach(c => {
    const el = document.createElement('div');
    el.className = 'char-tab' + (c.id === S.activeChar ? ' active' : '');
    el.innerHTML = `${esc(c.name)}<span class="del" onclick="event.stopPropagation();deleteChar('${c.id}')">✕</span>`;
    el.onclick = () => selectChar(c.id);
    strip.appendChild(el);
  });
  const ac = S.chars.find(c => c.id === S.activeChar);
  document.getElementById('bm-label').textContent = ac ? `${ac.name}'s Bookmarks` : 'Bookmarks';
}

function renderTypePills() {
  const wrap = document.getElementById('type-pills');
  wrap.innerHTML = '';
  ['All', ...TYPES].forEach(t => {
    const btn = document.createElement('button');
    const isActive = t === 'All' ? !S.typeFilter : S.typeFilter === t;
    btn.className = 'pill' + (isActive ? ' active' : '');
    btn.textContent = t === 'All' ? 'All' : t + 's';
    btn.onclick = () => { S.typeFilter = t === 'All' ? null : t; renderTypePills(); };
    wrap.appendChild(btn);
  });
}

function renderResults() {
  const sec  = document.getElementById('results-block');
  const list = document.getElementById('results-list');
  list.innerHTML = '';
  if (!S.results.length) { sec.style.display = 'none'; return; }
  sec.style.display = '';
  document.getElementById('result-count').textContent = `(${S.results.length})`;

  S.results.forEach(r => {
    const bmd = isBookmarked(r.id);
    const el  = document.createElement('div');
    el.className = 'result-item' + (S.activeEntry?.id === r.id ? ' active' : '');
    el.innerHTML = `
      <span class="type-badge ${typeCls(r.type)}">${r.type}</span>
      <span class="result-name">${esc(r.name)}</span>
      ${r.meta ? `<span class="result-meta">${esc(r.meta)}</span>` : ''}
      <button class="bm-star ${bmd ? 'on' : ''}"
        onclick="event.stopPropagation();quickBM('${esc(r.id)}','${esc(r.name)}','${r.type}','${esc(r.meta||'')}')"
        title="${bmd ? 'Bookmarked' : 'Bookmark'}">${bmd ? '★' : '☆'}</button>`;
    el.onclick = () => openEntry(r);
    list.appendChild(el);
  });
}

function renderBookmarks() {
  const list = document.getElementById('bm-list');
  list.innerHTML = '';

  if (!S.activeChar) {
    list.innerHTML = '<p class="sb-empty">Create a character to start bookmarking entries.</p>';
    return;
  }
  const bms = activeBMs();
  if (!bms.length) {
    list.innerHTML = '<p class="sb-empty">No bookmarks yet.<br>Search an entry and tap ☆ to save it here.</p>';
    return;
  }

  const groups = {};
  TYPES.forEach(t => groups[t] = []);
  bms.forEach(b => { if (groups[b.type]) groups[b.type].push(b); });

  TYPES.forEach(type => {
    if (!groups[type].length) return;
    const g = document.createElement('div');
    g.innerHTML = `<div class="bm-group-title">${type}s</div>`;
    groups[type].forEach(b => {
      const item = document.createElement('div');
      item.className = 'bm-item' + (S.activeEntry?.id === b.id ? ' active' : '');
      item.innerHTML = `
        <span class="type-badge ${typeCls(b.type)}" style="font-size:.42rem;padding:1px 4px">${b.type[0]}</span>
        <span class="bm-name">${esc(b.name)}</span>
        <button class="bm-del" onclick="event.stopPropagation();removeBM('${esc(b.id)}')" title="Remove">✕</button>`;
      item.onclick = () => openEntry(b);
      g.appendChild(item);
    });
    list.appendChild(g);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════
document.getElementById('nc-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeNewChar();
});

async function init() {
  await openDB();
  loadState();
  renderCharStrip();
  renderTypePills();
  renderBookmarks();

  const spellCount = SPELLS.length;
  const featCount  = FEATS.length;
  document.getElementById('data-status').textContent = `✓ ${spellCount} spells · ${featCount} feats · ${CLASSES.length} classes ready`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

init();
