
str = "abababa"
str_arr = list(str)
dp = {}
max_diff = 0
vals = []

def dfs(perm):
    
    if(len(str_arr) == 0):
        vals.append(perm[:])
    for i in range(len(str_arr)):
        val = str_arr.pop(i)
        dfs(perm+val)
        str_arr.insert(i,val)

dfs('')
print(vals)

for v in vals:
    c=0
    for i in range(len(str)):
        if(str[i]!=v[i]):
            c+=1
    max_diff = max(max_diff,c)

print(max_diff)
