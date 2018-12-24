#Assignment-7
#WAP to draw the graph of an quadratic equation: y=x^2+2*x+2
import matplotlib.pyplot as plt

a=[]
b=[]

for x in range(-50,50,3):
    y=x**2+2*x+2
    a.append(x)
    b.append(y)

plt.scatter(a,b)
plt.show()
