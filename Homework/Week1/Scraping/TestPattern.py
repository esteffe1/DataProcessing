import math

a=math.ceil(math.pow(3,2)*19)
print "Hello World, and welcome to CS ", int(a), "!"

from pattern.web import Twitter, plaintext

for tweet in Twitter().search('"more important than"', cached=False):
    print plaintext(tweet.description)