drop table ContainsIng;
drop table CantEat;
drop table AssociatedWithOrg;
drop table Follows;
drop table Creates;
drop table Saves;
drop table UsesEquip;
drop table RecipeBelongsToOrg;
drop table Review;
drop table Professional;
drop table HomeCook;
drop table Equipment;
drop table EquipLink;
drop table Recipe;
drop table Cuisine;
drop table Organization;
drop table Location;
drop table AppUser;
drop table Diet;
drop table Ingredient;

CREATE TABLE Diet (
    DName           VARCHAR2(20) PRIMARY KEY,
    Description     CLOB,
    MaxCalories     NUMBER(5),
    ProteinTarget   NUMBER(5),
    CarbsTarget     NUMBER(5),
    FatTarget       NUMBER(5)
);

CREATE TABLE Ingredient (
    IName           VARCHAR2(20) PRIMARY KEY,
    Calories        NUMBER(5),
    Price           NUMBER(8,2),
    ProteinAmount   NUMBER(5),
    CarbsAmount     NUMBER(5),
    FatAmount       NUMBER(5)
);

CREATE TABLE Location (
    PostalCode      VARCHAR2(20),
    Country         VARCHAR2(20),
    City            VARCHAR2(20),
    PRIMARY KEY (PostalCode, Country)
);

CREATE TABLE Organization (
    OrgName         VARCHAR2(20) PRIMARY KEY,
    Rating          NUMBER(2, 1) CHECK (Rating BETWEEN 1.0 AND 5.0),
    PostalCode      VARCHAR2(20),
    Country         VARCHAR2(20),
    StreetAddr      VARCHAR2(40),
    FOREIGN KEY (PostalCode, Country) REFERENCES Location(PostalCode, Country)
);

CREATE TABLE EquipLink (
    LinkToBuy       VARCHAR2(255) PRIMARY KEY,
    RecBrand        VARCHAR2(20)
);

CREATE TABLE Equipment (
    EName           VARCHAR2(20) PRIMARY KEY,
    LinkToBuy       VARCHAR2(255),
    Price           NUMBER(8,2),
    FOREIGN KEY (LinkToBuy) REFERENCES EquipLink(LinkToBuy)
);

CREATE TABLE AppUser (
    UserName            VARCHAR2(20) PRIMARY KEY,
    ProfileDescription  CLOB,
    DateCreated         DATE,
    UserPassword        VARCHAR2(40),
    DietName            VARCHAR2(20),
    FOREIGN KEY (DietName) REFERENCES Diet(DName)
);

CREATE TABLE Cuisine (
    CName           VARCHAR2(20) PRIMARY KEY,
    Description     CLOB,
    Technique       CLOB,
    SignatureFood   VARCHAR2(20) UNIQUE
);

CREATE TABLE Recipe (
    RecipeID        NUMBER(10) PRIMARY KEY,
    CName           VARCHAR2(20) NOT NULL,
    TimeEstimate    NUMBER(10),
    Servings        NUMBER(10),
    Title           VARCHAR2(100),
    Instructions    CLOB,
    FOREIGN KEY (CName) REFERENCES Cuisine(CName)
);

CREATE TABLE Review (
    ReviewID        NUMBER(10),
    RecID           NUMBER(10),
    UserName        VARCHAR2(20),
    Rating          NUMBER(2, 1) CHECK (Rating BETWEEN 1.0 AND 5.0),
    ReviewComment   CLOB,
    ReviewDate      DATE,
    PRIMARY KEY (RecID, ReviewID),
    UNIQUE (RecID, UserName),
    FOREIGN KEY (UserName) REFERENCES AppUser(UserName),
    FOREIGN KEY (RecID) REFERENCES Recipe(RecipeID)
);

CREATE TABLE Professional (
    UserName        VARCHAR2(20) PRIMARY KEY,
    Position        VARCHAR2(20),
    FOREIGN KEY (UserName) REFERENCES AppUser(UserName)
);

CREATE TABLE HomeCook (
    UserName        VARCHAR2(20) PRIMARY KEY,
    Experience      VARCHAR2(20),
    FOREIGN KEY (UserName) REFERENCES AppUser(UserName)
);

CREATE TABLE CantEat (
    DName           VARCHAR2(20),
    IName           VARCHAR2(20),
    PRIMARY KEY (DName, IName),
    FOREIGN KEY (DName) REFERENCES Diet(DName),
    FOREIGN KEY (IName) REFERENCES Ingredient(IName)
);

CREATE TABLE RecipeBelongsToOrg (
    OrgName         VARCHAR2(20),
    RecID           NUMBER(10),
    PRIMARY KEY (OrgName, RecID),
    FOREIGN KEY (OrgName) REFERENCES Organization(OrgName),
    FOREIGN KEY (RecID) REFERENCES Recipe(RecipeID)
);

CREATE TABLE UsesEquip (
    RecID           NUMBER(10),
    EName           VARCHAR2(20),
    PRIMARY KEY (RecID, EName),
    FOREIGN KEY (RecID) REFERENCES Recipe(RecipeID),
    FOREIGN KEY (EName) REFERENCES Equipment(EName)
);

CREATE TABLE Follows (
    FollowerUserName    VARCHAR2(20),
    FollowedUserName    VARCHAR2(20),
    PRIMARY KEY (FollowerUserName, FollowedUserName),
    FOREIGN KEY (FollowerUserName) REFERENCES AppUser(UserName),
    FOREIGN KEY (FollowedUserName) REFERENCES AppUser(UserName)
);

CREATE TABLE Saves (
    UserName        VARCHAR2(20),
    RecID           NUMBER(10),
    PRIMARY KEY (UserName, RecID),
    FOREIGN KEY (UserName) REFERENCES AppUser(UserName),
    FOREIGN KEY (RecID) REFERENCES Recipe(RecipeID)
);

CREATE TABLE Creates (
    UserName        VARCHAR2(20),
    RecID           NUMBER(10),
    PRIMARY KEY (UserName, RecID),
    FOREIGN KEY (UserName) REFERENCES AppUser(UserName),
    FOREIGN KEY (RecID) REFERENCES Recipe(RecipeID)
);

CREATE TABLE AssociatedWithOrg (
    OrgName         VARCHAR2(20),
    UserName        VARCHAR2(20),
    PRIMARY KEY (OrgName, UserName),
    FOREIGN KEY (OrgName) REFERENCES Organization(OrgName),
    FOREIGN KEY (UserName) REFERENCES AppUser(UserName)
);

CREATE TABLE ContainsIng (
    RecID           NUMBER(10),
    IName           VARCHAR2(20),
    Amount          VARCHAR2(20),
    PRIMARY KEY (RecID, IName),
    FOREIGN KEY (RecID) REFERENCES Recipe(RecipeID),
    FOREIGN KEY (IName) REFERENCES Ingredient(IName)
);

insert into Cuisine values('Italian', 'placeholder', 'Soffritto, Slow-braising, ...', 'Pasta, Pizza');
insert into Cuisine values('Mexican', 'placeholder', 'Nixtamalization, comal-roasting, ...', 'Tamales, Tacos');
insert into Cuisine values('Thai', 'placeholder', 'Wok Stir-fry', 'Pad Thai');
insert into Cuisine values('Indian', 'placeholder', 'Tadka, Bhunao, ...', 'Palak Paneer');
insert into Cuisine values('French', 'placeholder', 'Searing, braising, ...', 'Macarons');
INSERT INTO Cuisine VALUES ('Misc', 'Foods that do not fit into other categories', 'Techniques from all over the world', 'Anything');

INSERT INTO Diet VALUES ('my diet', 'placeholder', 2500, 20, 7, 2);
INSERT INTO Diet VALUES ('Ultra Keto', 'placeholder', 4000, 10, 0, 9001);
INSERT INTO Diet VALUES ('carnivore', 'placeholder', 5000, 1000, 30, 20);
INSERT INTO Diet VALUES ('new diet (1)', 'placeholder', 2500, 20, 20, 20);
INSERT INTO Diet VALUES ('Vegetarian', 'placeholder', 2500, 60, 200, 60);

insert into AppUser values('JoeBurger', 'placeholder', DATE '2026-03-01', 'placeholder', 'my diet');
insert into AppUser values('BillTin', 'placeholder', DATE '2025-05-06', 'placeholder', 'my diet');
insert into AppUser values('Batman', 'placeholder', DATE '2026-02-03', 'placeholder', 'my diet');
insert into AppUser values('CoolGuy29', 'placeholder', DATE '2026-01-23', 'placeholder', 'carnivore');
insert into AppUser values('MrBeast', 'placeholder', DATE '2026-02-06', 'placeholder', 'carnivore');
insert into AppUser values('KnockPlateu', 'placeholder', DATE '2026-03-01', 'placeholder', 'carnivore');
insert into AppUser values('CarefreeIsle', 'placeholder', DATE '2025-05-06', 'placeholder', 'Vegetarian');
insert into AppUser values('ShredLovely', 'placeholder', DATE '2026-02-03', 'placeholder', 'Vegetarian');
insert into AppUser values('PhotoExpand', 'placeholder', DATE '2026-01-23', 'placeholder', 'Vegetarian');
insert into AppUser values('AnnoyBerserk', 'placeholder', DATE '2026-02-06', 'placeholder', 'new diet (1)');
insert into AppUser values('Breaking299', 'placeholder', DATE '2025-05-06', 'placeholder', 'new diet (1)');

insert into Follows values('MrBeast', 'Batman');
insert into Follows values('MrBeast', 'BillTin');
insert into Follows values('JoeBurger', 'Batman');
insert into Follows values('CoolGuy29', 'MrBeast');
insert into Follows values('Batman', 'JoeBurger');

INSERT INTO Recipe VALUES (0, 'French', 30, 4, 'Scuffed French Onion Soup', 'Saute onions, add broth, simmer, top with bread.');
INSERT INTO Recipe VALUES (1, 'Mexican', 5, 1, 'Salsa with just tomatoes', 'Chop tomatoes, season, and mix.');
INSERT INTO Recipe VALUES (2, 'Italian', 60, 2, 'Spaghetti but Replace Pasta with Bread', 'Toast bread, make sauce, combine and serve.');
INSERT INTO Recipe VALUES (3, 'Thai', 45, 3, 'Pad Thai but not really', 'Stir-fry ingredients and season to taste.');
INSERT INTO Recipe VALUES (4, 'Indian', 40, 2, 'Curry but its made of tomatoes, onions, and bread for some reason', 'Cook onions and tomatoes, add spices, simmer.');
INSERT INTO Recipe VALUES (5, 'French', 20, 2, 'Crepes', 'Mix batter, cook in a pan.');
INSERT INTO Recipe VALUES (6, 'Mexican', 35, 4, 'Guacamole', 'Mash avocado with lime and salt.');
INSERT INTO Recipe VALUES (7, 'Italian', 90, 8, 'Pizza', 'Top dough, bake until done.');
INSERT INTO Recipe VALUES (8, 'Thai', 25, 2, 'Herb soup', 'Simmer broth, add herbs.');
INSERT INTO Recipe VALUES (9, 'Indian', 55, 6, 'Spiced rice', 'Toast spices, add rice and water, cook.');
INSERT INTO Recipe VALUES (10, 'French', 15, 1, 'Bread and butter', 'Spread butter on bread.');
INSERT INTO Recipe VALUES (11, 'Mexican', 50, 3, 'Lettuce tacos', 'Fill lettuce with filling, serve.');
INSERT INTO Recipe VALUES (12, 'Thai', 40, 4, 'Stir fry', 'Cook on high heat until done.');
INSERT INTO Recipe VALUES (13, 'Italian', 12, 1, 'Garlic bread', 'Butter bread, add garlic, heat.');
INSERT INTO Recipe VALUES (14, 'Indian', 70, 5, 'Dal', 'Simmer lentils until soft.');

insert into Saves values('MrBeast', 0);
insert into Saves values('JoeBurger', 1);
insert into Saves values('JoeBurger', 0);
insert into Saves values('JoeBurger', 12);
insert into Saves values('BillTin', 2);
insert into Saves values('CoolGuy29', 3);
insert into Saves values('Batman', 4);
insert into Saves values('Batman', 5);
insert into Saves values('Batman', 6);
insert into Saves values('Batman', 7);

insert into Creates values('Batman', 0);
insert into Creates values('MrBeast', 1);
insert into Creates values('JoeBurger', 2);
insert into Creates values('CoolGuy29', 3);
insert into Creates values('BillTin', 4);
insert into Creates values('KnockPlateu', 5);
insert into Creates values('KnockPlateu', 6);
insert into Creates values('CarefreeIsle', 7);
insert into Creates values('CarefreeIsle', 8);
insert into Creates values('CarefreeIsle', 9);
insert into Creates values('ShredLovely', 10);
insert into Creates values('PhotoExpand', 11);
insert into Creates values('PhotoExpand', 12);
insert into Creates values('PhotoExpand', 13);
insert into Creates values('AnnoyBerserk', 14);

insert into Review values(0, 0, 'JoeBurger', 5.0, 'Very tasty', DATE '2025-02-04');
insert into Review values(0, 5, 'JoeBurger', 5.0, 'Very tasty', DATE '2025-10-13');
insert into Review values(0, 10, 'JoeBurger', 5.0, 'Very tasty', DATE '2025-08-24');
insert into Review values(1, 1, 'BillTin', 5.0, 'Very tasty', DATE '2025-01-08');
insert into Review values(2, 2, 'Batman', 1.0, 'Why', DATE '2026-03-04');
insert into Review values(2, 7, 'Batman', 4.0, 'Classic', DATE '2025-03-26');
insert into Review values(2, 13, 'Batman', 5.0, 'Just like momma used to make', DATE '2025-06-12');
insert into Review values(3, 3, 'CoolGuy29', 5.0, 'Very tasty', DATE '2025-08-03');
insert into Review values(1523, 3, 'Breaking299', 1.0, 'Not my thing', DATE '2025-09-23');
insert into Review values(4, 4, 'MrBeast', 2.3, 'Needs more salt', DATE '2025-07-09');
insert into Review values(5, 4, 'CarefreeIsle', 2.3, 'Needs more salt', DATE '2025-02-05');
insert into Review values(6, 4, 'ShredLovely', 2.3, 'Needs more salt', DATE '2025-08-07');
insert into Review values(7, 4, 'PhotoExpand', 2.3, 'Needs less salt', DATE '2025-12-15');
insert into Review values(8, 4, 'JoeBurger', 1.0, 'No Burger', DATE '2025-07-23');
insert into Review values(9, 2, 'MrBeast', 4.6, 'It;s alright', DATE '2025-12-31');
insert into Review values(10, 2, 'Breaking299', 1.0, 'What has the world come to', DATE '2025-11-11');
INSERT INTO Review VALUES (98, 5, 'ShredLovely', 4.5, 'tasty', DATE '2025-10-10');
INSERT INTO Review VALUES (674, 5, 'KnockPlateu', 2.0, 'You call this a crepe? My french bulldog is disappointed', DATE '2025-10-12');
INSERT INTO Review VALUES (85, 6, 'KnockPlateu', 5.0, 'wow the person who made this is amazing', DATE '2025-02-16');
INSERT INTO Review VALUES (62, 6, 'CarefreeIsle', 1.0, 'this tastes awful', DATE '2026-02-17');
INSERT INTO Review VALUES (671, 6, 'AnnoyBerserk', 1.5, 'i have no words', DATE '2025-03-01');
INSERT INTO Review VALUES (165, 7, 'PhotoExpand', 2.5, 'at least it;s better than dominos', DATE '2025-03-01');
INSERT INTO Review VALUES (23, 7, 'CoolGuy29', 5.0, 'best pizza ever', DATE '2025-09-15');
INSERT INTO Review VALUES (62732, 7, 'ShredLovely', 4.2, 'pretty good', DATE '2025-10-01');
INSERT INTO Review VALUES (1256, 8, 'KnockPlateu', 5.0, 'the plants, the plants are speaking to me', DATE '2025-10-20');
INSERT INTO Review VALUES (3723, 8, 'BillTin', 4.5, 'very good', DATE '2025-10-22');
INSERT INTO Review VALUES (54, 8, 'JoeBurger', 2.0, 'why is it jsut herbs in water', DATE '2025-10-25');
INSERT INTO Review VALUES (163, 9, 'CarefreeIsle', 5.0, 'the spices really elevate the rice', DATE '2025-12-30');
INSERT INTO Review VALUES (5377, 9, 'AnnoyBerserk', 4.2, 'Good', DATE '2026-04-01');
INSERT INTO Review VALUES (982, 10, 'MrBeast', 4.5, 'subscribe to MrBeast', DATE '2026-01-31');
INSERT INTO Review VALUES (7651, 10, 'PhotoExpand', 5.0, 'this one is my bread and butter', DATE '2025-11-11');
INSERT INTO Review VALUES (921, 11, 'ShredLovely', 4.4, 'lettuce is a nice change from bread', DATE '2025-06-19');
INSERT INTO Review VALUES (123, 11, 'CoolGuy29', 1.5, 'i replaced the meat with more lettuce and it was awful', DATE '2025-07-20');
INSERT INTO Review VALUES (612, 11, 'Breaking299', 1.0, 'Who came up with this? Were you high?', DATE '2025-08-15');
INSERT INTO Review VALUES (7612, 12, 'KnockPlateu', 5.0, 'STIR, STIR,FRY and STIR!!! !', DATE '2025-09-10');
INSERT INTO Review VALUES (789, 13, 'PhotoExpand', 4.8, 'Youre telling me a garlic buttered this bread?', DATE '2025-10-05');
INSERT INTO Review VALUES (2727, 13, 'MrBeast', 4.0, 'Even better with Feastables instead of garlic!', DATE '2025-11-07');
INSERT INTO Review VALUES (9678, 14, 'JoeBurger', 4.5, 'I could eat this all day', DATE '2025-12-01');
INSERT INTO Review VALUES (564, 14, 'KnockPlateu', 4.0, 'lenil', DATE '2025-12-02');
INSERT INTO Review VALUES (76, 14, 'ShredLovely', 2.8, 'eh', DATE '2025-12-03');

insert into Location
values('V6X 1B7', 'Canada', 'Vancouver');

insert into Location
values('V6B 1X9', 'Canada', 'Vancouver');

insert into Location
values('V8X 2L9', 'Canada', 'Vancouver');

insert into Location
values('V0P 3H5', 'Canada', 'Vancouver');

insert into Location
values('V8Z 2L1', 'Canada', 'Vancouver');

insert into Organization
values('HelloFresh', 4.5, 'V6X 1B7',
'Canada', '6223 Bateman St.');

insert into Organization
values('Goodfood', 4.1, 'V6B 1X9',
'Canada', '6784 Granville St.');

insert into Organization
values('Crisper', 4.0, 'V8X 2L9',
'Canada', '2205 Burrard St.');

insert into Organization
values('Fresh Prep', 4.8, 'V0P 3H5',
'Canada', '3116 Drake St.');

insert into Organization
values('Chefs Plate', 3.8, 'V8Z 2L1',
'Canada', '1015 Davie St.');

INSERT INTO EquipLink VALUES ('ninja.com', 'Ninja');
INSERT INTO EquipLink VALUES ('ikea.ca', 'IKEA');
INSERT INTO EquipLink VALUES ('philips.ca', 'Philips');

insert into Equipment
values('Blender', 'ninja.com', 129.99);

insert into Equipment
values('Air Fryer', 'philips.ca', 199.99);

insert into Equipment
values('Frying Pan', 'ikea.ca', 89.99);

insert into Equipment
values('Mixer', 'philips.ca', 349.99);

insert into Equipment
values('Rice Cooker', 'philips.ca', 159.99);


insert into UsesEquip
values(0, 'Blender');

insert into UsesEquip
values(1, 'Air Fryer');

insert into UsesEquip
values(2, 'Frying Pan');

insert into UsesEquip
values(3, 'Mixer');

insert into UsesEquip
values(4, 'Rice Cooker');


insert into RecipeBelongsToOrg
values('HelloFresh', 0);

insert into RecipeBelongsToOrg
values('Goodfood', 1);

insert into RecipeBelongsToOrg
values('Crisper', 2);

insert into RecipeBelongsToOrg
values('Fresh Prep', 3);

insert into RecipeBelongsToOrg
values('Chefs Plate', 4);

INSERT INTO Ingredient VALUES ('Tomato', 10, 0.99, 1, 1, 1);
INSERT INTO Ingredient VALUES ('Onion', 10, 0.99, 1, 1, 1);
INSERT INTO Ingredient VALUES ('Bread', 500, 5.00, 1, 99, 1);
INSERT INTO Ingredient VALUES ('Salt', 0, 0.50, 0, 0, 0);
INSERT INTO Ingredient VALUES ('Sugar', 100, 0.50, 0, 50, 0);
INSERT INTO Ingredient VALUES ('Spicy Peppers', 20, 1.00, 0, 5, 0);
INSERT INTO Ingredient VALUES ('Garlic', 5, 0.25, 0, 1, 0);
INSERT INTO Ingredient VALUES ('Olive Oil', 120, 10.00, 0, 0, 14);
INSERT INTO Ingredient VALUES ('Butter', 150, 8.00, 0, 0, 17);
INSERT INTO Ingredient VALUES ('Avocado', 200, 2.00, 3, 15, 18);
INSERT INTO Ingredient VALUES ('Noodles', 350, 2.50, 10, 70, 5);
INSERT INTO Ingredient VALUES ('Rice', 400, 1.50, 8, 80, 2);
INSERT INTO Ingredient VALUES ('Lentils', 300, 1.00, 20, 40, 5);
INSERT INTO Ingredient VALUES ('Lettuce', 5, 0.99, 0, 1, 0);
INSERT INTO Ingredient VALUES ('Cheese', 200, 3.00, 10, 0, 15);
INSERT INTO Ingredient VALUES ('Spices', 50, 0.75, 0, 10, 0);
INSERT INTO Ingredient VALUES ('Milk', 100, 1.00, 8, 12, 5);
INSERT INTO Ingredient VALUES ('Flour', 400, 2.00, 10, 80, 1);
INSERT INTO Ingredient VALUES ('Lime', 20, 0.50, 0, 7, 0);
INSERT INTO Ingredient VALUES ('Herbs', 5, 0.25, 0, 1, 0);
INSERT INTO Ingredient VALUES ('Beef', 500, 10.00, 50, 0, 30);
INSERT INTO Ingredient VALUES ('Cooking Oil', 120, 5.00, 0, 0, 14);

insert into ContainsIng
values(0, 'Tomato', '2');

insert into ContainsIng
values(1, 'Onion', '2');

insert into ContainsIng
values(2, 'Bread', '3');

insert into ContainsIng
values(3, 'Salt', '4 pinches');

insert into ContainsIng
values(4, 'Sugar', '2 cups');

INSERT INTO ContainsIng VALUES (0, 'Onion', '1');
INSERT INTO ContainsIng VALUES (0, 'Salt', '1 pinch');
INSERT INTO ContainsIng VALUES (0, 'Bread', '1 slice');
INSERT INTO ContainsIng VALUES (1, 'Tomato', '3');
INSERT INTO ContainsIng VALUES (2, 'Tomato', '2');
INSERT INTO ContainsIng VALUES (3, 'Noodles', '200g');
INSERT INTO ContainsIng VALUES (4, 'Tomato', '1');
INSERT INTO ContainsIng VALUES (4,'Onion', '1');
INSERT INTO ContainsIng VALUES (4, 'Bread', '2 slices');
INSERT INTO ContainsIng VALUES (4, 'Salt', '2 pinches');
INSERT INTO ContainsIng VALUES (4, 'Spices', '1 tbsp');
INSERT INTO ContainsIng VALUES (5, 'Butter', 'a lot');
INSERT INTO ContainsIng VALUES (5, 'Flour', '2 cups');
INSERT INTO ContainsIng VALUES (5, 'Milk', '1 cup');
INSERT INTO ContainsIng VALUES (6, 'Avocado', '1');
INSERT INTO ContainsIng VALUES (6, 'Salt', '1 pinch');
INSERT INTO ContainsIng VALUES (6, 'Lime', '1');
INSERT INTO ContainsIng VALUES (7, 'Flour', '2 cups');
INSERT INTO ContainsIng VALUES (7, 'Olive Oil', '3 tbsp');
INSERT INTO ContainsIng VALUES (7, 'Tomato', '1');
INSERT INTO ContainsIng VALUES (7, 'Cheese', '1 cup');
INSERT INTO ContainsIng VALUES (8, 'Herbs', 'go with your gut');
INSERT INTO ContainsIng VALUES (8, 'Salt', '1 pinch');
INSERT INTO ContainsIng VALUES (9, 'Spices', '1 tbsp');
INSERT INTO ContainsIng VALUES (9, 'Rice', '2 cups');
INSERT INTO ContainsIng VALUES (10, 'Bread', '2 slices');
INSERT INTO ContainsIng VALUES (10, 'Butter', '1 tbsp');
INSERT INTO ContainsIng VALUES (11, 'Lettuce', '3 leaves');
INSERT INTO ContainsIng VALUES (11, 'Cheese', '1 cup');
INSERT INTO ContainsIng VALUES (11, 'Tomato', '1');
INSERT INTO ContainsIng VALUES (11, 'Beef', '100g');
INSERT INTO ContainsIng VALUES (12, 'Spicy Peppers', '5');
INSERT INTO ContainsIng VALUES (12, 'Garlic', '2 cloves');
INSERT INTO ContainsIng VALUES (12, 'Cooking Oil', '2 tbsp');
INSERT INTO ContainsIng VALUES (12, 'Onion', '1');
INSERT INTO ContainsIng VALUES (12, 'Beef', '200g');
INSERT INTO ContainsIng VALUES (13, 'Bread', '1 loaf');
INSERT INTO ContainsIng VALUES (13, 'Garlic', '3 cloves');
INSERT INTO ContainsIng VALUES (13, 'Butter', '2 tbsp');
INSERT INTO ContainsIng VALUES (14, 'Lentils', '2 cups');
INSERT INTO ContainsIng VALUES (14, 'Spices', '1 tbsp');



INSERT INTO CantEat VALUES ('my diet', 'Tomato');
INSERT INTO CantEat VALUES ('Ultra Keto', 'Bread');
INSERT INTO CantEat VALUES ('carnivore', 'Tomato');
INSERT INTO CantEat VALUES ('carnivore', 'Onion');
INSERT INTO CantEat VALUES ('new diet (1)', 'Salt');
INSERT INTO CantEat VALUES ('Vegetarian', 'Beef');

INSERT INTO Professional VALUES ('JoeBurger', 'CEO');
INSERT INTO Professional VALUES ('MrBeast', 'YouTuber');
INSERT INTO Professional VALUES ('PhotoExpand', 'Line Cook');
INSERT INTO Professional VALUES ('AnnoyBerserk', 'Server');
INSERT INTO Professional VALUES ('CarefreeIsle', 'Chef');

INSERT INTO HomeCook VALUES ('Batman', '0 years home cook');
INSERT INTO HomeCook VALUES ('CoolGuy29', 'Line Cook');
INSERT INTO HomeCook VALUES ('BillTin', '2');
INSERT INTO HomeCook VALUES ('KnockPlateu', 'no');
INSERT INTO HomeCook VALUES ('ShredLovely', 'no');

INSERT INTO AssociatedWithOrg VALUES ('Goodfood', 'JoeBurger');
INSERT INTO AssociatedWithOrg VALUES ('HelloFresh', 'Batman');
INSERT INTO AssociatedWithOrg VALUES ('Crisper', 'KnockPlateu');

COMMIT;