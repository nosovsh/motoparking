from main import *
from random import choice

users = User.objects(pk__in=("5507e87eccb1cf000b353cc5", "5509d45ce409dd000b805f28", "55080a4675cbba000b92cbb6",))

if __name__ == "__main__":
    for parking in Parking.objects(user__in=("55100de58534e3000bdb8d99", "5507e87eccb1cf000b353cc5",)):
        print parking.id
        opinions = Opinion.objects(parking=parking)
        if len(opinions) == 1:
            opinion = opinions[0]
            print "yeah"
            user = choice(users)
            # print parking.user.pk
            parking.user = user
            parking.save()
            # print parking.user.pk
            # print opinion.user.pk
            opinion.user = user
            opinion.save()
            # print opinion.user.pk

