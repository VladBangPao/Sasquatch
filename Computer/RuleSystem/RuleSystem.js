import util from 'node:util'
import { CodeMap } from "./CodeMap/CodeMap.js"
import {CoordinateClock} from "../Matrix/Coordinates.js"
import {Neighborhood} from "./Neighborhood/Neighborhood.js"
import {createHash} from 'node:crypto'
import {RuleTree} from "./RuleTree/RuleTree.js"

export class RuleSystem{
	constructor(input, output, context, dimension){
		this.dimension=dimension
		this.map = new CodeMap(input, output, context).map

		//1-2 neighbors for 1 dimension; 2-4 for 2 dimensions; 
		//3-6 for 3 dimensions;  4-8 for 4 dimensions 
		this.rt = new RuleTree(this.map, dimension)
		// this.hash(this.map)
		// this._coordinates(this.map)
	}


	hash(map){
		var ruleKeys = Object.keys(map['rules'])
		for(var i = 0; i<ruleKeys.length; i++){
			var rule = JSON.stringify(map['rules'][ruleKeys[i]]['neighborhood'])
			map['rules'][ruleKeys[i]]['nhHash']=createHash('sha256').update(rule).digest('hex'); 
		}
	}

	//public api
	rule(neighborhood){
		//a neighborhood looks like this
		//console.log(neighborhood, neighbor_codes, neighbor_count)

		var neighbor_keys = Object.keys(neighborhood)
		var neighbor_count = neighbor_keys.length
		var neighbor_codes = []
		for(var i = 0; i<neighbor_count; i++){
			neighbor_codes.push(neighborhood[neighbor_keys[i]])
		}
		neighbor_codes.sort()

		var rule = this.map['ruleTree'][neighbor_count]
		for(var i = 0; i<neighbor_count; i++){
			rule = rule[neighbor_codes[i]]
		}
		//returns just a code
		return rule
	}

	shape(dim){
		return this.map['rules'][dim]['shape']
	}

	neighborhood(dimension){
		return this.map['rules'][dimension]['neighborhood'] 
	}

	coordinates(dimension){
		return this.map['rules'][dimension]['coordinates']
	}
	_coordinates(map){
		var ruleKeys = Object.keys(map['rules'])
		for(var j = 0; j<ruleKeys.length; j++){
			var d = parseInt([ruleKeys[j]])
			var c1=[]
			var c2=[]
			for(var i = 0; i<d; i++){
				c1.push(0)
				c2.push(parseInt(map['rules'][ruleKeys[j]]['shape'])-1)
			}
			var coordinates = new CoordinateClock(c1, c2).coordinates()
			for(var i = 0; i<coordinates.length; i++){
				coordinates[i]=coordinates[i].join(',')
			}
			map['rules'][ruleKeys[j]]['coordinates']=coordinates
		}
	}

	neighbors(dimension, coordinate){
		return this.map['rules'][dimension]['neighborhood'][coordinate]
	}

	export(to, filetype){
		//filetype can be csv
		//or plain txt
		//or zip file
	}

	inputVector(){
		return this.map['inputVector']
	}

	outputVector(){
		return this.map['outputVector']
	}

	log(){
		//console.log(this.map)
		console.log(util.inspect(this.map, {showHidden: false, depth: 3, colors: true}))
	}
}

var rs = new RuleSystem('1234567890qwertyuiopasdfghjklzxcvbnm,.1234567890qwertyuiopasdfghjklzxcvbnm.1234567890qwertyuiopasdfghjklzxcvbnm,.1234567890qwertyuiopasdfghjklzxcvbnm,.', 'aksduowqxkzjvhxkczjvzxc,mvniruweqoiruqewghaskjdhgasdkj', 'english', [2])
rs.log()
// console.log(["〃", "、"].sort())
// var neighborhood = {
// 	'01':"〃",
// 	'10':"、"
// }
// console.log(rs.rule(neighborhood))

//we can take the coordinate tree, and update it as a reference, and it should affect the matrix