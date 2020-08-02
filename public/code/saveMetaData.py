import argparse
import os

parser = argparse.ArgumentParser()
parser.add_argument("fileAddr",help = "File name for the recorded audio",type= str)
parser.add_argument("txt",help = "txt file details",type= str)
parser.add_argument("age",help = "Age",type= str)
parser.add_argument("gender",help = "Gender",type= str)
parser.add_argument("country",help = "nationality",type= str)
print("fsdkhujidksfirfjdsklm")
args = parser.parse_args()
f = args.fileAddr
txt = args.txt
age = args.age
gender = args.gender 
country = args.country

path = os.getcwd()+ f
pathMetaData = os.getcwd()+"/public/uploads/metadata.csv"
metaData = open(pathMetaData, "a")
filename = f.split("/")[-1]
print(path)
metaData.write("\n"+filename+","+age+","+gender+","+country)
txtFile = open(path,"w")
txtFile.write(txt)
