| Test # | Verb | Table    | Date               | Expected                                                       | Acutal                                                       |
|--------|------|----------|--------------------|----------------------------------------------------------------|--------------------------------------------------------------|
| 1      | GET  | Customer | first=Joe          | custID = 1 first=Joe last=Bzolay phone=555-555-1212            | custID = 1 first=Joe last=Bzolay phone=555-555-1212          |
| 2      | GET  | Product  | prodName=Wandoozal | prodID = 2 name=Wandoozals price=2.35 weight=0.532 inStock=YES | prodID = 2 name=Wandoozals price=2.35 weight=0.532 inStock=1 |
| 3      | GET  | Order    | orderID=3          | orderID=3 custID=3 orderDate=10-05-11 poNum=N/A                | orderID=3 custID=3 orderDate=2011-10-05T04:00:00.000Z poNum= |
