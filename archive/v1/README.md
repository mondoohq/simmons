# Simmons v1: The Python Era

The initial implementation of Simmons was written in Python for expediency.   However, there are 2 key drawbacks:

1. Nearly everything at Mondoo is implemented in either TypeScript or Go
2. The Python API doesn't implement video recording

Video recording is key to debugging failures effectively.

In this directory you'll find the initial Python implementation of the test and it's accompanying Github Actions workflow.
