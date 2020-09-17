const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
	{
		name: "Red Rover Ridge",
		image: "https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360_1280.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor consequat id porta nibh. Nec nam aliquam sem et tortor consequat id porta nibh. Faucibus et molestie ac feugiat sed lectus vestibulum mattis. Cras pulvinar mattis nunc sed blandit libero volutpat sed."
		// description: "A beautiful landscape of layered red rock and desert vegetation. DANGER: Watch for rattlesnakes!"
	}, 
	{
		name: "Glacier Lake",
		image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137_1280.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor consequat id porta nibh. Nec nam aliquam sem et tortor consequat id porta nibh. Faucibus et molestie ac feugiat sed lectus vestibulum mattis. Cras pulvinar mattis nunc sed blandit libero volutpat sed."
		// description: "This lake at the top of the mountain has lots of snow and ice."
	}, 
	{
		name: "Salmon Creek",
		image: "https://cdn.pixabay.com/photo/2017/07/17/16/21/nature-2512944_1280.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor consequat id porta nibh. Nec nam aliquam sem et tortor consequat id porta nibh. Faucibus et molestie ac feugiat sed lectus vestibulum mattis. Cras pulvinar mattis nunc sed blandit libero volutpat sed."
		// description: "This picturesque hike follows along a river teeming with wildlife"
	}, 
];

function seedDB() {
	//remove all campgrounds
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log("removed all campgrounds");
			
			//loop through data and create new campgrounds
			data.forEach( (seed) => {
				Campground.create(seed, (err, campground) => {
					if (err) {
						console.error(err);
					} else {
						console.log("added a campground");
						
						//create a comment on each campground
						Comment.create({
							text: "This place is great, but I wish it had internet!",
							author: "Homer"
						}, (err, comment) => {
							if (err) {
								console.error(err);
							} else {
								console.log("comment successfully created");
								
								//add comment to campground
								campground.comments.push(comment);
								campground.save()
							}
						})
					}
				})
			})
		}
	});
}

module.exports = seedDB;
