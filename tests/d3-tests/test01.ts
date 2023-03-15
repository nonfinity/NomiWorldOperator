export const test01 = {
    "environment": {
        "hubs": {
            "0": {
                "id": 0,
                "name": "Barcelona"
            },
            "1": {
                "id": 1,
                "name": "Valencia"
            },
            "2": {
                "id": 2,
                "name": "Malaga"
            }
        },
        "edges": {
            "0": {
                "id": 0,
                "pointA": {
                    "id": 0,
                    "name": "Barcelona"
                },
                "pointB": {
                    "id": 1,
                    "name": "Valencia"
                },
                "cost": 7,
                "distance": 3,
                "shipSize": 9
            },
            "1": {
                "id": 1,
                "pointA": {
                    "id": 1,
                    "name": "Valencia"
                },
                "pointB": {
                    "id": 2,
                    "name": "Malaga"
                },
                "cost": 5,
                "distance": 5,
                "shipSize": 11
            },
            "2": {
                "id": 2,
                "pointA": {
                    "id": 0,
                    "name": "Barcelona"
                },
                "pointB": {
                    "id": 2,
                    "name": "Malaga"
                },
                "cost": 3,
                "distance": 7,
                "shipSize": 13
            }
        },
        "items": {
            "0": {
                "id": 0,
                "name": "Food",
                "basePrice": 20,
                "minReserve": 0.2,
                "swing": 0.5,
                "k_exp": 1
            }
        }
    },
    "ticks": [
        {
            "time": 1,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 210,
            "invRatio": 1.05,
            "price": 19.5
        },
        {
            "time": 1,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 205,
            "invRatio": 0.9761904761904762,
            "price": 20.238095238095237
        },
        {
            "time": 1,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 205,
            "invRatio": 0.9761904761904762,
            "price": 20.238095238095237
        },
        {
            "time": 2,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 220,
            "invRatio": 1.1,
            "price": 19
        },
        {
            "time": 2,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 200,
            "invRatio": 0.9523809523809523,
            "price": 20.476190476190478
        },
        {
            "time": 2,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 200,
            "invRatio": 0.9523809523809523,
            "price": 20.476190476190478
        },
        {
            "time": 3,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 230,
            "invRatio": 1.15,
            "price": 18.5
        },
        {
            "time": 3,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 195,
            "invRatio": 0.9285714285714286,
            "price": 20.714285714285715
        },
        {
            "time": 3,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 195,
            "invRatio": 0.9285714285714286,
            "price": 20.714285714285715
        },
        {
            "time": 4,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 240,
            "invRatio": 1.2,
            "price": 18
        },
        {
            "time": 4,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 190,
            "invRatio": 0.9047619047619048,
            "price": 20.952380952380953
        },
        {
            "time": 4,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 190,
            "invRatio": 0.9047619047619048,
            "price": 20.952380952380953
        },
        {
            "time": 5,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 237,
            "invRatio": 1.185,
            "price": 18.15
        },
        {
            "time": 5,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 185,
            "invRatio": 0.8809523809523809,
            "price": 21.19047619047619
        },
        {
            "time": 5,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 185,
            "invRatio": 0.8809523809523809,
            "price": 21.19047619047619
        },
        {
            "time": 6,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 234,
            "invRatio": 1.17,
            "price": 18.3
        },
        {
            "time": 6,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 180,
            "invRatio": 0.8571428571428571,
            "price": 21.428571428571427
        },
        {
            "time": 6,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 180,
            "invRatio": 0.8571428571428571,
            "price": 21.428571428571427
        },
        {
            "time": 7,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 231,
            "invRatio": 1.155,
            "price": 18.45
        },
        {
            "time": 7,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 175,
            "invRatio": 0.8333333333333334,
            "price": 21.666666666666664
        },
        {
            "time": 7,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 175,
            "invRatio": 0.8333333333333334,
            "price": 21.666666666666664
        },
        {
            "time": 8,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 228,
            "invRatio": 1.14,
            "price": 18.6
        },
        {
            "time": 8,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 170,
            "invRatio": 0.8095238095238095,
            "price": 21.904761904761905
        },
        {
            "time": 8,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 170,
            "invRatio": 0.8095238095238095,
            "price": 21.904761904761905
        },
        {
            "time": 9,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 225,
            "invRatio": 1.125,
            "price": 18.75
        },
        {
            "time": 9,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 165,
            "invRatio": 0.7857142857142857,
            "price": 22.142857142857146
        },
        {
            "time": 9,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 165,
            "invRatio": 0.7857142857142857,
            "price": 22.142857142857146
        },
        {
            "time": 10,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 222,
            "invRatio": 1.11,
            "price": 18.9
        },
        {
            "time": 10,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 160,
            "invRatio": 0.7619047619047619,
            "price": 22.38095238095238
        },
        {
            "time": 10,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 160,
            "invRatio": 0.7619047619047619,
            "price": 22.38095238095238
        },
        {
            "time": 11,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 219,
            "invRatio": 1.095,
            "price": 19.05
        },
        {
            "time": 11,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 155,
            "invRatio": 0.7380952380952381,
            "price": 22.61904761904762
        },
        {
            "time": 11,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 155,
            "invRatio": 0.7380952380952381,
            "price": 22.61904761904762
        },
        {
            "time": 12,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 216,
            "invRatio": 1.08,
            "price": 19.2
        },
        {
            "time": 12,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 150,
            "invRatio": 0.7142857142857143,
            "price": 22.857142857142854
        },
        {
            "time": 12,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 163,
            "invRatio": 0.7761904761904762,
            "price": 22.23809523809524
        },
        {
            "time": 13,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 213,
            "invRatio": 1.065,
            "price": 19.35
        },
        {
            "time": 13,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 145,
            "invRatio": 0.6904761904761905,
            "price": 23.095238095238095
        },
        {
            "time": 13,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 171,
            "invRatio": 0.8142857142857143,
            "price": 21.857142857142858
        },
        {
            "time": 14,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 223,
            "invRatio": 1.115,
            "price": 18.85
        },
        {
            "time": 14,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 140,
            "invRatio": 0.6666666666666666,
            "price": 23.333333333333336
        },
        {
            "time": 14,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 179,
            "invRatio": 0.8523809523809524,
            "price": 21.476190476190474
        },
        {
            "time": 15,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 233,
            "invRatio": 1.165,
            "price": 18.35
        },
        {
            "time": 15,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 135,
            "invRatio": 0.6428571428571429,
            "price": 23.571428571428573
        },
        {
            "time": 15,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 187,
            "invRatio": 0.8904761904761904,
            "price": 21.095238095238095
        },
        {
            "time": 16,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 243,
            "invRatio": 1.215,
            "price": 17.849999999999998
        },
        {
            "time": 16,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 130,
            "invRatio": 0.6190476190476191,
            "price": 23.80952380952381
        },
        {
            "time": 16,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 195,
            "invRatio": 0.9285714285714286,
            "price": 20.714285714285715
        },
        {
            "time": 17,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 253,
            "invRatio": 1.265,
            "price": 17.35
        },
        {
            "time": 17,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 125,
            "invRatio": 0.5952380952380952,
            "price": 24.047619047619047
        },
        {
            "time": 17,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 203,
            "invRatio": 0.9666666666666667,
            "price": 20.333333333333332
        },
        {
            "time": 18,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 254,
            "invRatio": 1.27,
            "price": 17.3
        },
        {
            "time": 18,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 120,
            "invRatio": 0.5714285714285714,
            "price": 24.285714285714285
        },
        {
            "time": 18,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 211,
            "invRatio": 1.0047619047619047,
            "price": 19.952380952380953
        },
        {
            "time": 19,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 255,
            "invRatio": 1.275,
            "price": 17.25
        },
        {
            "time": 19,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 115,
            "invRatio": 0.5476190476190477,
            "price": 24.523809523809526
        },
        {
            "time": 19,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 219,
            "invRatio": 1.042857142857143,
            "price": 19.57142857142857
        },
        {
            "time": 20,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 256,
            "invRatio": 1.28,
            "price": 17.2
        },
        {
            "time": 20,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 110,
            "invRatio": 0.5238095238095238,
            "price": 24.761904761904763
        },
        {
            "time": 20,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 216,
            "invRatio": 1.0285714285714285,
            "price": 19.714285714285715
        },
        {
            "time": 21,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 257,
            "invRatio": 1.285,
            "price": 17.150000000000002
        },
        {
            "time": 21,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 114,
            "invRatio": 0.5428571428571428,
            "price": 24.571428571428573
        },
        {
            "time": 21,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 211,
            "invRatio": 1.0047619047619047,
            "price": 19.952380952380953
        },
        {
            "time": 22,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 245,
            "invRatio": 1.225,
            "price": 17.75
        },
        {
            "time": 22,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 118,
            "invRatio": 0.5619047619047619,
            "price": 24.38095238095238
        },
        {
            "time": 22,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 206,
            "invRatio": 0.9809523809523809,
            "price": 20.19047619047619
        },
        {
            "time": 23,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 242,
            "invRatio": 1.21,
            "price": 17.9
        },
        {
            "time": 23,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 122,
            "invRatio": 0.580952380952381,
            "price": 24.19047619047619
        },
        {
            "time": 23,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 201,
            "invRatio": 0.9571428571428572,
            "price": 20.428571428571427
        },
        {
            "time": 24,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 239,
            "invRatio": 1.195,
            "price": 18.05
        },
        {
            "time": 24,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 126,
            "invRatio": 0.6,
            "price": 24
        },
        {
            "time": 24,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 196,
            "invRatio": 0.9333333333333333,
            "price": 20.666666666666668
        },
        {
            "time": 25,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 236,
            "invRatio": 1.18,
            "price": 18.2
        },
        {
            "time": 25,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 141,
            "invRatio": 0.6714285714285714,
            "price": 23.28571428571429
        },
        {
            "time": 25,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 191,
            "invRatio": 0.9095238095238095,
            "price": 20.904761904761905
        },
        {
            "time": 26,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 233,
            "invRatio": 1.165,
            "price": 18.35
        },
        {
            "time": 26,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 136,
            "invRatio": 0.6476190476190476,
            "price": 23.523809523809526
        },
        {
            "time": 26,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 186,
            "invRatio": 0.8857142857142857,
            "price": 21.142857142857142
        },
        {
            "time": 27,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 230,
            "invRatio": 1.15,
            "price": 18.5
        },
        {
            "time": 27,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 131,
            "invRatio": 0.6238095238095238,
            "price": 23.761904761904763
        },
        {
            "time": 27,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 181,
            "invRatio": 0.861904761904762,
            "price": 21.38095238095238
        },
        {
            "time": 28,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 227,
            "invRatio": 1.135,
            "price": 18.65
        },
        {
            "time": 28,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 126,
            "invRatio": 0.6,
            "price": 24
        },
        {
            "time": 28,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 176,
            "invRatio": 0.8380952380952381,
            "price": 21.619047619047617
        },
        {
            "time": 29,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 224,
            "invRatio": 1.12,
            "price": 18.799999999999997
        },
        {
            "time": 29,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 121,
            "invRatio": 0.5761904761904761,
            "price": 24.23809523809524
        },
        {
            "time": 29,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 184,
            "invRatio": 0.8761904761904762,
            "price": 21.238095238095237
        },
        {
            "time": 30,
            "hub_id": 0,
            "hub_name": "Barcelona",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 234,
            "invRatio": 1.17,
            "price": 18.3
        },
        {
            "time": 30,
            "hub_id": 1,
            "hub_name": "Valencia",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 116,
            "invRatio": 0.5523809523809524,
            "price": 24.476190476190474
        },
        {
            "time": 30,
            "hub_id": 2,
            "hub_name": "Malaga",
            "item_id": 0,
            "item_name": "Food",
            "inventory": 192,
            "invRatio": 0.9142857142857143,
            "price": 20.857142857142858
        }
    ],
    "shipments": []
}