const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes
	}
	return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	const reducer = (sum, item, itemIndex, blog) => {
		if (blog[itemIndex] > blog[sum]) {
			return itemIndex
		} else {
			return sum
		}
	}
	const helpList = blogs.map(item => item.likes)
	const helpVal = blogs[helpList.reduce(reducer, 0)]
	return { title: helpVal.title, author: helpVal.author, likes: helpVal.likes }
}

const mostBlogs = (blogs) => {
	const helpList = blogs.map(item => item.author)
	const authorBlogs = _.countBy(helpList)
	let initialVal = { author: '', blogs: 0, }

	_.forEach(authorBlogs, (value, key) => {
		if (value > initialVal.blogs) {
			initialVal = { author: key, blogs: value }
		}
	})
	return initialVal

}

const mostLikes = (blogs) => {
	const helpList = blogs.map(item => {
		return { author: item.author, likes: item.likes }
	})

	const retVal = _.reduce(helpList, (result, value) => {
		(result[value.author] || (result[value.author] = [])).push(value.likes)
		return result
	}, {})

	let initialVal = {author: '', likes: 0}

	_.forEach(retVal, (value, key) => {
		let likeAmount = value.reduce((sum, n) => sum+n)
		if (likeAmount >= initialVal.likes) {
			initialVal = {author: key, likes: likeAmount }
		}
	})
	
	return initialVal
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}