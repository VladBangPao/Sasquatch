import {CoordinatesTest} from "./Utils/Matrix/Coordinates/Test.js"
import {MatrixTest} from "./Utils/Matrix/Matrix/Test.js"
import {CombinatoricsTest} from "./Utils/Combinatorics/Test.js"

class Test{
    constructor(){
        this.tests()
    }

    tests(){
        new CoordinatesTest()
        new MatrixTest()
        new CombinatoricsTest()
    }
}
new Test()