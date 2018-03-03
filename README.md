# Homework 4: L-systems

## Description
Emiliya Al Yafei • PennKey: alyafei

Space cube tree!

Cubes are dirrently colored as the tree grows. Instead of foliage, a glowering aura appears around the tree. 

![](tree1.png)

![](tree2.png)

## Rules
[F] : grow upwards
[X] : get a random X-Z direction
[Y] : move a random amount in some direction
[+/-] : move in +ive or -ive X direction
[S] : draw aura sphere
[B] : set up base

[Expansion:]
* 'X' --> 'FF[−XYS]FFF[XYS][−XS]+XYS'
* 'F' --> 'F[XYS]'
* '+', 'F[+YS]FFF[XYS][−XS]+XYS'
* '-', 'F[-YS]FFF[XYS][−XS]+XYS'
* 'B', 'B'

## Problems Occured
The OBJ loader indexes the vertices wrong. This seems to be more of a result of the sphere than of the Mesh class itself.


## OBJ loading
So that you can more easily generate interesting-looking plants, we ask that you
enable your program to import OBJ files and store their information in VBOs. You
can either implement your own OBJ parser, or use an OBJ-loading package via NPM:

[obj-mtl-loader](https://www.npmjs.com/package/obj-mtl-loader)

[webgl-obj-loader](https://www.npmjs.com/package/webgl-obj-loader)


## Aesthetic Requirements
Your plant must have the following attributes:
* It must grow in 3D
* It must have flowers, leaves, or some other branch decoration in addition to
basic branch geometry
* Organic variation (i.e. noise or randomness in grammar expansion)
* A flavorful twist. Don't just make a basic variation on the example broccoli
grammar from the slides! Create a plant that is unique to you!

Feel free to use the resources linked in the slides for inspiration!

## Interactivity
Using dat.GUI, make at least three aspects of your demo an interactive variable.
For example, you could modify:

* The axiom
* Your input grammar rules and their probability
* The angle of rotation of the turtle
* The size or color or material of the cylinder the turtle draws

Don't feel restricted to these examples; make any attributes adjustable that you
want!

## Examples from last year (Click to go to live demo)

Andrea Lin:

[![](andreaLin.png)](http://andrea-lin.com/Project3-LSystems/)

Tabatha Hickman:

[![](tabathaHickman.png)](https://tabathah.github.io/Project3-LSystems/)

Joe Klinger:

[![](joeKlinger.png)](https://klingerj.github.io/Project3-LSystems/)

## Extra Credit (Up to 20 points)
For bonus points, add functionality to your L-system drawing that ensures
geometry will never overlap. In other words, make your plant behave like a
real-life plant so that its branches and other components don't compete for the
same space. The more complex you make your L-system self-interaction, the more
points you'll earn.
