const schema = require('../../utils/schema.js');
const canvasUtil = require('../../utils/canvas.js');
// 品牌 Logo 直接内联（data URL）——独立模块文件在部分环境无法进入编译包，内联到已有文件最可靠
const defaultLogoDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAL96VFh0UmF3IHByb2ZpbGUgdHlwZSBBUFAxAAAYlX1P7Q7CMAj836fYIxwfZe3jNGYzS4yavf8PadrqlqhHgJYAd4Trcl/27TI998e63ZYwVTAQNGvmAiChQQBiUM0eG3oW8pcPYe5/btlymqGHvoIToneYGM3ubaCG3PbooBV28x0F37hRRR44dCyXH/V4rpeuiVG03sC9nsbdY50IWXQlycyjui4xdSeBiWTBf+skjZc/giL7bOq18930nnOEF+FEVfJmB+ePAAAd90lEQVR4nO16eXhURdb3qaq79N7pLfsGhD0gSlBZNKDAICjikiiMC8gMCi6ouLyunTjqoCiIvDAKojiCaBpFQREUhAgqOxhIIAlZyN7pJL13372+PyLzMvN+oxLA+f74zvPc53bfW/fUOb86derUqYPg/zGilCIoKkJFP/8vKiqiAAAIIXox+kMXg+lvJUopAvBg2FWOYBdoqLhY+71lYH7vDgEAKHVjgMEIIaQCgHrm+aZNmwxpxkoXw2gOJSwixmyiFJkinEEfNkl8IHNUYfxfWCEAN8L4L1pZWRmXm5srnassvysA1O3GUASAUPdIHzy4yZlpqrtGh9SRLNXsiFZKsqz6WQxhwaD6BY2KcUSUiCDHuhDvO3jw4KkFCza3RPq3okOVKRRKixWAYrrgmVfyKyoqjgKABN1W/Zuny+82BSgtIQgVqgAArTXrLncYow+wbCQDZOhsDxgrtx4jNV9XIWlfdVhs9suCzWKPC5rU0sUPaYR3x4T/b4LPcC+1NFXUzbbqmfpNf39to9vtxsXnOI0uOgButxuPHbsLjxtXqjRUl+QkO/2LWYsuMdCsbn9oTUz88kBwRLDLf5kqRJMQIIwZncjrOEoQpYqqKixLFAYkH0+gBhCpSjAaQ5Isy4oomO0GlKljlM0/frJ0fU+UB7h4ACAAoAUFBWSDx6NSAOiqWjrXZhNfANa6dewCb0Npmf9mILg/q8lV/VyobHKeMXTVMCublUhki8FgjceivsaWQKy+neqO1wtcvU/UIdaYhqhG7CZGSbEZqsaM6Pfe5Mm3H+ip8mcEvcBEEUD3koUAoNdod+bml9lXBvWG8duPG5dOfK7+aqqIE3q72PInphpPTc9n9ZYMqwUSzHEA5AeVqiDGQiABB6EoK4ZjEAyKKgBiqRTzcbyuxWJOrCUZWQfASuoLCwE8nkL1V4T6t3RBnWD3SCDtqZfeSHr56Tvizrznxz1Z0PVqloVJe6nE9cSz6+oWmPQofcEU7tB918gpyYlCtojN36/dytW/vd3HVbbRdH9MNqmaxthtCX6icx6IkIE7YuvyWy+knGfTBbOAM2Y4ddaCQSMHpTuXbigbMX2sebZ7anjg1ur0l25f1DQzPUmf8tq0SNfEoSgoc66lE980MMdqA7cyDB3E8nqVNZq7WE4Xp1RFoqyYWAJZZhOHrXpyOMmkPb7jjce/fc6dz6Sm9kctLSlqT83+bLowALjdGIqLtZGFC3ITTOyYqqpWjdGbpm5/IjYkTi2HhjwWTuFZ5cqltwRh8nDzrke3ZC/x7A3f77TivllO5rvrctmaMdmyIcUYNRsMhCMsAQm45qqAq2Hx9xa0ryY2waqTb3aY8Ppj7zw+U9EoAKUILkB0eCEAQFBQgEeZsw2RTnmFjZE/3n+i4+VNTzr35NhDt/zpo5T3dvzU8eSCq3zwwLXsF9M+HLzZ29L4oNXKLT+4aOxGRvMOa2xr693h6+Tbo5CmYdacYadcryRI4vXcML1RrxJX6pfLtjo2/WVz4M9pZjHxEjk0/v33i4Wz/c1/DoCCAgIej5ozbs5b6dmZFWX79k9Iz0hsWD+z67Y4JGwYUaQOHtqHjHl7mrfspe8HvHn4ZMuUaXnpDyxfvqilo+WHu2VZE1KyxnwMAGAvWJOWqo+OC6va1ZIk6iYN0Vc+MzGk75OhTgbe1Bscpof73hlLtPLCVU8+MvmWwlyPAlBM4RwCn38lfF7Ku90YPB71kgl/GiZhbqTqbzwdESHv1dvZlkhcZjbX5XyGsZh3ZVpAjYH9/QMnQmlNnpv+uHz5ohZKYzNMct0aFDyxjlLae6c7nwl+MrO5/O/3r52cHfiLSxePf1EuvjhisWlKr/9KfE+V9IsgEHqn+h1Ix6xt/cq3tjwKUKwVFBSclw7nB8CuXRgBQEdUdRsSbN/U1LXewOot+5OY9nyGN60qfqm2UacjuiQLattZnyGYsbgaZRbGGxoa9KB6H/XV7qVqqJIANP732KJd2nq1hNxaUED+9tJzjcc+eO5eJye9kpagDjNQ76vm+erVH/6Qehv444X7n2q7heMdtTOffuUyj8ejut3uHutxPgAgKC1VHps61SzIyqQEi25/RELXZCXyhyRRSrS7Et/tMwiAYzCoyNh6ydBBx4dlXN/mdrtxRoZjEMi+4UK0hUrR05ocqp8EADkFUEBLSkpg6ZYt/NVuN9PZHFwSCUaESxOVnZmMd+K9a1peL95of1IRYtf8raApN6DlRg4efJstLi7+D0yBn03vk3o6QmN5nZNVJVGUkq/Iioc1xASzJ7xRuXPpxFqiCI0nO/QDb7ntj9+XlBRAcXGxBlrgATV4jJqT+smGxByFlWoBwD8BIaQhhNT5kyeLpcXFytYVN18pyio7YECvjKF8a5ch1Jy1aJfwwqflvR/kIfrAklubcG2tTaPU3WNf1nMA2tsRpRQpOvNlKmeMRYOdWFY0GJKhtyPO0lFUVASZowrjHUeOjT9UHfVdM+2O5xBCKhVaBmla6M5Y+0/InD6MNaeOUMXAaaTJnQ9RoW4ApdH0ULR5GqWta8rrfEs62jtwXu8EktS3n9caaaowyuHM6eu02xGQD5Rg5eLCwkLV46n4DwAA3VkaQRCcSFNYQIRHmKE6o4FjOP5ocXGxRikdSWnZLQc2FzdPv33qzK07v1wDPP0Iqx2AddYYb8lAnDHZK6tyHIun+2lIOyqFy6vNhtDG2ob6m59892hiXt/U9knXDrenJCd7dVk5VVzjwRP6eOuUuz9JbrHx4Ny7c2l6YaFH7U6u/E4AUEoRlJZqlFKLgUiMqmosa0pgCWGlBp/kS7CllFcfWPlGW8W7P0gtn75sCpWOnjmqK/MPw/13Q3j7EOBPEdaSfRyYtFmITV7HmpLLwdAAOFbKc3Ba3f5jZf01j20jrCBHV89LjXc1lyfeNzWvM6iQAcmpSVvAW0N3noxfH0O27QkoMBIAADyeHunSw71AEQIADaQf+mSl2pTWAE9jrEHHYjXSEtEn9Bk5lu/qkm5p+HElrag/LKUMHsOak/rLTFvdQYPVHrVkZqugs6xj+Kx1AABKuPQE4PiY5pCYtWiTf8gqz5HUvF724FvzzXGmY3emOWcmYhMcg6w6piXCpycnNB3d0SGL47+oS9p2W/+gAwBgl6u8RxbQIwDOzLmTu/ckZNvZ5h/aZdQpoqFGIlcdPunLAJP5Dbupj9ueOWB15Y5lTMR7CiUNHYLt6f0TAesRSMmFfAJ/pLV12xXJyc6ximDYd+UDu6s7Ortua2vyCs/ellN3z0hfcjxY5cqeOB8AO/eAeOLTAelmww910uwUm2mhPxYdv+lI3Dl3hK0JAGDsWOjRvuC8fEBzSzMzabiJqh0Nvo7W1mmOZOd+X1fkEozyOhCyvQsxWtD/2odx6uCxtG7H60y4cmNfVY6mAsdFw41rXkhOpPctW19Oh9/z4Rp/a8PrdoiVlr0x6PCDo5syEWO2Zl/zKIBq3lZfnzwhWL2n5aahSAjFFbu9T68ICnvlmoZANvQaXAsA6OeI8PcBoLx8EAUACEak1r4pSj8TiF9GQ/E0nJZjMugN5LKb7r+MUoqRMXuDFArfk3JJAe47fi5trzuqtR1YFYjULPnIxInGYXcebFjiOfVKa11zx40Dldv3L7b0tsmHpkjWIbrES2aEQOLmIC57Uq9eSNCI8bK8TNkWjwiiiBg7Q+XTsbjkAnbUYYACjFDPwuEeAdDt4QGVDbztZDQS6Tv7upQfJF+72BZlCp1pKTWh9uBshJD23nvv6XjrwDVSKHCXJWOsbO83UWWip1NB1X7krq/gm9v8z3c1NLzQvv65Ma++eCfbVnlsKHENle29x4ISDs1GfPaqhoYSPQCAIkeJhZMkqkhyICLoqaq0UUUkCKFIT3Q4LwAAAIqK8knxuHFKIBz/8o4rxDwq4qWCz5fYQqy5rmT7+D/c/vDgWbNmiTt37mR46+APQBWqUKyNlXHysn5zGp2M2DHvuiH6JwIHl1VCNveTEtNe6opyp5RYiAVFjMYo3UlpCcnIKJd31lEdwZCFGCJjjDHGRAU1TkESOiilCPLbf/84oLi4VCkpKSHi5as+7AzFrt7idtTGak8e6Drd0Kdd5+rrQ7pFBAFdsWIFpZRmxoLNfULBSPX0t3SW1rr6aS/PHbXi5Smtc6u/mLtOaD/SjzGoqQZnb0fDicMAmoQtrMUAUE6rj2Ta9Kfevkungz4+gQlxSDMl6Fk/qzc5Oawe6z4xGttTNc7HCVJUUFCgvbt8SXKX6nqVjTcse3X+iNdou7e2ta4ZtSPbdRMeem2ux+NRhVjtPQaLathebSvfs7O88LXHxx291v7dbUHF1EvhXMLO1c+oJ7/1MM6sXFtnW5smhtt1oCcpCBVrvpry+3i1bbCBU5K/OwHAaIKeleJNhOFcSY6EbQAABYkV/4ntMAKEEMX+A13Pe7Qoa0x44+qUitULH7z0sXhL5+5YfT1U1bQseWbpOxN1BnqPLHCh59/8YfQtUwd23pzb0dfRL985+LonYODER3Ujbp5Pavd/o+7buJLGozEa953EANY/ndhVPE4KNt/pStRroCrKyk0+K69E2/2+dhMGNbb88YLvAQB5PJ4eJ0XPZxmkUFBAtmzZ0qZTOvFdb+vrkx2GJeNSK/5+6O3B61Sff2Hn6Sbpsy/3bGs63QYfbT7p9UdE+t/PXM30GjXFljrspk4lEnxZCYfecPaf0D75iZXEmOBEMb+X1Bw/CKDUzLJC87cYk/VUCo0Bij6rqPFek6Anmzp9vvGMFl+Xl5cnQ34+OQ8dzjMf4PGoUFBAju3b9BGn+of1f1QNZGVlPmWWat+qW589YtXTo4siEfXtL7dXLJrv3tD40oJJWnKfkckKpK7obGofxpoHPcNaBj/SUNU6EmjCpiun/zU29q6nIBqJU7F1NxOOCW0Zg6+UkdB56fJvXVv1nDbChNTPZEXLvaRv4iIAN4bS0h6PPsCFygkCIFpSgtLcq7/uiLMNe5aPKenjaHuSGAyjrdk5h042ZkfHT1+cdmrPIj3mbU/zfPI6AIAff/wwaWAvl9GWPKGWAsCTS5b/fcqY3mNH5sSSFV8FG9R6L+io3PZfg/s41+sK2xJSHYxoY7Q6UYGq8t1rPzmTjvtPA/APPhgBTRk85TO/xOYhxrLwq9cHd141KfX6NWt8gR17m/t8sHBAbqytscJgcXWB3tAMRN9YcYrtmPfmIWdVm3gTy+uOly/LGmFySiOCweR5lXu2jUyzKvl/ej/xsb1Hyl8YPSRlQTCiZu/ZsmZFQUEBOZ+5/0+CXyDqBgGADrjqjgfaOkOvhqKqokh4o91KSb9eztAtf+hXpsiS3huULD+dCidWNIZz/BLbV9KYpj9Nyty66hEyCTC9SoynPnJgx05ngi4wd1/XFYWPv/n94jHD05/vl+ryv7awaHdRURG6EGcC/xD6AhICcCOAYm3+/PkJW/Z55wYj8btjEvSOKZhQRDBhMCgqigHHexmOOXDjSMfhv81krBaT+qDG6tqwbdTjP25aO8GpC0/b7x/0yNOrqu9Od+mXl+1av2Xdhx+SwsKeH4P9G4EvBhUQgG7zZAhAyUcfTKytO31FbX29wLMM9E5G0ogc1pViiPYBBkYiXi+ytuzVJ493HFY6yx6xmDnduiOZqz7f3XplhpOs3/PNR/ug22Ff8AqSi3k8joYPn8McOrRSpS3fOepq914a62rPFWKRXooiJciqGGN5o5cxJteEw6okBurG6DltqMrYNjz3uW1fqLky6ea8pB3FK1ZELoSz+7dCXgymv4WO1sd7Rao2DAmc3pfCo5hRzxuPj7lrxdd3f6voUrY9YFy4cHlnd0s3Brh4tUM9ByA//9eTKYmJFDzd+TqPpxDv3h1mqqu7X40bl8phbNMef/z16FlfMNBdM0R/Pm+kAG4E+bt+PV7pjgcuSiXZRSUE3ZMb/e/Hv1v/59qelpSUkKJlnz8uajhRFUWLpskINO0fcSXCrMrqTAGnkdTs+3r125QCQgDUOXjynZKKHKom8xhjhDSgFDACRDHVqEQwljIc5iPHfvh4N+TnM1BaqmQNu3FyVMP5miKCpmkEFBU00CiloLG8DmsA1MCxWv7lvV9bv3JxB6UUnUtNYY9yguXlhbS2dfLTvE7PJVp1n8kSJYihVNM0wIQAy3K4NST+WRC0oxjgbRUANArI0FddTBm9k0O0lWoIUUQxaJRSDaKEZU0KY0kUgb4NALuhRmQBQInKymQBDPf3y3Ac4TkWAwCoqiIHAqGAy+mw17V0DI4KKo8V8h4AdBQVFZ1TlViPACgCN7xKv++Q4wrvjfoEwBxBDEsxAGiqCgRpSEW8qGGm68w3BAPl+hKBgLpbqvv66rgocxgh6a05cwwfNgSG9u8/GHlKK7/TMNtdEUZ4CgBIEaW4iijEItAoYiJSzDIIMLAsC+Guji4hFrGrCmQpskoBAIrPUZdzAoBSCggh+Ommm/RcyX6HLCtdGWkpVRowSAMNNE0DolENM4it8wYYDVj2zLeqRhHfdzJNcZhT8aVTD6YOm+ZDANctOh64yesX18alysWKGGKowcyd3WWC1eoTENvZFZVtohAhZh3yY4w0QQajqACv0xtkE2E68obmBD4GAPc5gnBOACDU7TI2vvSSDIh4DSazIxCH2aoS0+k4RkCI0pisGUAllNWZCMdi9YwtEowoyRyLVcUUs5p0n7RG5Jdzx97xUFNn5DaKkL9X77TPTrZFH6Wq3L3eX54o33TZnJSTHbF0h47bdtonT5YBJxgN/HYEEJc1caAok5QUk2GrjiGd731emg8AnuJzNIFz3Q7T/Px8ptjjkbJd5lVmHgVzUgwvjh6YMtHEkzaO40wDMy1/cOiEMVcPcGTNufGSGYAwAABVtQa9yWy2doWiwsk9H//VgOLbTrUGlkqyOsqho8/mZGXXM5wBADPdmHk82tC8XCvHcAPigpqAMREAkAyIaAgQRoSNIoQUjCgva8juSLD2PzNAFxEANy4tLVVmz34oqc4bvb+pS+xV3Rx49UBtx6ZT3vDw2rZw0t7KjvdrvLRk++H6Das2Ht1TOOuJSQAAa974hKdAdBzDKIKsQrqNf0GloGEEwvQrUtfXNrXqEFBQ1G4P7na70QeffvNcVIg7KIhWRRR4QhgWsbp0zBvtmPDpVANGkFWHLEcTfIHQHVNnzBv7c9HEb06S/PYp8HNR0lNPPZW0Zkv5PqrJWeMu6/csyxpkwBTtLau5Nx6Pp44ePnATg1mVUpXKkiwxiFQCAGz9qcqsakAYFp/Ssww0BenrDFCsqlT37u7TK75dNu7PX3x3DIhCDZRSghBS88ZOX6lgduppb+BRUVQhN8f+aDgq94rK2rWDsp13lJ9qfqipI3Z1uo05kuSwvEl5qILuFNlvjhx/OwA/m1dLLCYSgtZmJxodJ2oaZ0oyBYZhQJLkVEWj7JGyyj8iBDJiDUx2sqXkm5LFdQAANQ3BXE1VIdmp94YuvWldRxRf2SeJzPRHlSt9UXzfncWfHiGgCAzHmUZfN8s9atLMvV2h2LimruhcI4c/4w2QHQsFc2SJdnn9wsABSWxAU5UUKytv7Axpw+Ny5HmHVVcGAC3/E0VeSAB+XlvfX7o0gAGebTw4h02Z1TheEgSEEKII+NdAUTNBER5DiIiKrGIs4RZKKcIY0eaAMIMiBtlNxnCTt3V6opFfcmz35+/fPe+xbVv21MyIxOVLWI5rEGVtaFN76FKCEbKaydosl/6k3cxX17cLT0RVdKvZADuwPxxt8kVeFCWlb3ZGcvGQnOQXjlU2DB7ez7X3CwCAc8gVnIPX6C5J2/LBFst9b6w6HIiIFkJwCAAh0DRQAfVWgQBP1DqqqRQAayrheANWT1yX65i74UhnDc+Sk/7jnw2cNO3uvl9tfL9ao89jgGLt5rsfGPD52uUnk4dMecUvck8wCCDLzkwo31OyPfvyWzd1RcQbLCbddzzRaJtfdBGWGzQwiZtR643maZj9M6Yyurx/4qWbPatPnalZvNAAIIB8AlCqut1uvrSs856YBCZFEQnGAIQQyrJsFAAgHo8ZCcEaIEIpYMJj6k3hdR8daTg9x6AjlWWlnm0AQAHyGYBSFfLzCZSWKgAFpGC2xXr4eOQ5VRYDd9/gf8njScS6VMNlOkL8B755t7L/mIK/BOJ4HMco2+r3fvIXSgHeX7TIuPDT/dfpjbZvDm1fGQQA9DPPC785wj1YZn6JzpUdAoDzyoH/G56/+r5g3jzj0X2Nj1OKko1GUzzNadpaedp3Y0SmBkRlOYFH3hMHNz87cHThCwgoW/G956miojX8e5s2/5UhyEwIQ1nCbC7/fu1mhIqQ2w26kq0/PYIRzgKgYbMOfdoeUG6Pa9iIqKbpsFg/aXSfN74+6C3iEXWKmoaSklNfHb95xYm3Bk1ZbjTwjEYVMFtMH5R9++Hu5EET1iQ5LCvK9nxyYHzBHHNljW/xpQPTX9+0blnFr5XS/2IckN996EDLy3w3+AX0vN1pWZGZaH0XMehYvyTTEgpwI8vrulx2/TujJt7sisXi031B8YFRE+90FRXNFGWNPpiakrLDlGDc3BmJff7www9bAYq1tV8cntARUV+02s0rkgzMahqXT43on7iMsMx0ilFzb5fl75/uqv5UlKUBFkyfiMvaidr6pp01d9zn1ADuGz36sg2SBoe87f5v28t3GkXg7moLKW8iAO1EdfP9MWq4p66l0wkAUFzxywVUvwhAafc8Qi4ifcWw5LPa1sC2w/Xee/2iHPrqqw+qqBJvlYVo3e5vPHXtQeZBp83xNsZwpNEX/i+OIEoptHR2dd7g9frvwqCuGBSPR6GggKSn20t5jt1wqjH4VVUYP6RLtosbSt6pAlVoi0aCFdu3expEyo+zJFhf/vHHje2rZl27RJRl48E67yUawtU/HS2frkryDRyhLzzz3kFXis30pRCPu9JyJ91jIGQYI3c1SYKcCABQ8EsK/hoAPxPVdCb97WOz5vXPtl8riMo8f0f0PgqANIpsFDGsOz+fkWTlVkWS+poM+mBYUmev+9tCqywJOlURfpKkWJ6sKq33rlwpAwBYHSbD1JG9HssdkHFtPBa793RTYI6iAdIQk4AwZ6UUEMegulAgPINgBPev/W4CIYhJS0qoUWTBiTD6SaFkJOLMlZs3bwIxGmlNshoWCsiwOiPd9QFGOBwVhGQAAE/7Lx+d/zIAPxdDCpLc94vvG1Z5vbE5Fh5vMgB8WuR2o2Sn/XSS3db0ozXrKruJ+eb4Dx/NWb1w7q0OI9u04suq65Mc5pMum6M0xW65xWYyPHjPfc/2B4+HdrYEMnccql9eX9swz0jUz5Jsls0AFFz2hFNpSfYwQm6Uk2ItAFUY0H/EtNUI0Hyn1XzX9iGZ9Ul2S9foK3I3W4z8XTqivThu5LD+tgRT7PXn71lr0ykrSje/u9liMdclJdoVAID83zDCv4lKSkpIrytuSMJn4cmx3XEUQgjwWS8YAkAIBobgs9oSOHuzggAg5/JJlrP7YBkMhPzzmNhz/rnNmT7P8MQYA/6XYaSUspTS3xTknUMc8I81FeWNK+jnNJuGxCQaS0m0Z6VnuMrbG4LlcYjNpBo9FgzFBxGsHGKIfiDDwnGjXp8RFZR0PU/L/R3hKFLRybagLzstI1sy6HVIlQVndX1Do81s7t8vw364sT0yQAVUoSpKvjPBdEKhzChJiDd5A4HKVJcriWWYQQxBnQ2tga6BvVNi9c2to1x2a+XHQutX4BlEzyWLfE7Lan5+PnP69GktOa3vLLPFUBMOixOSXLZ0UYKsuqbmAMLkj6qsBGRFuyMYCBo1ikZFQuEEWdWChGdIc1O7GJPkPKQ0bY+rhhepBhOAIlc4HJ0hiBIgzM5r7YpzVNOmCqI0gGcYmVJ2oKJpV2uq7BclukBTtb6CKA8xGjlvIBSb0eYPZxJEWwMhobLxi/XNAKXnMrA9S4peO+1ORzwoOBHRxfukOtVWf5hjWU0D0AGQqBgNqqZQJBQzmfTEiA1CiENCQ3uF0rR3rzh8+PW6Q4e+iI2ccFOiU2dHoNMbmpobRF7HI4vDEm9qDNkzUmzRttZmzDGsEelNspHVNCtHIgjx+i45KmANGfVGVkSsQTx2uFY3bFRaJFhTEy8tLVXOUZ//Tz0lBG43BnBjt7v7AqDon++AujdQcPYF/3I/q+2Zq5vH//x2Y/hf/M5u80+8z5n+DyGVrAaDB5qPAAAAAElFTkSuQmCC';

const RENDER_DEBOUNCE = 280;

Page({
  data: {
    group: 'single',
    tplKey: 'classic',
    tplName: '',
    tagline: '',
    themeOptions: schema.themeOptions,
    sizeOptions: schema.sizeOptions,
    themeKey: 'lavender',
    sizeKey: '1080x1440',
    sizeLabel: '1080 × 1440',
    cw: 320,
    ch: 427,
    safeBottom: 0,
    form: {},
    hasPhoto: false,
    hasPhotoA: false,
    hasPhotoB: false,
    logoWatermark: false,
    logoMode: 'tile',
    logoSrc: '',
    groupTemplates: []
  },

  onLoad(options) {
    const group = schema.groups.some((g) => g.key === options.g) ? options.g : 'single';
    const map = schema.templates[group];
    const tplKey = map && map[options.t] ? options.t : Object.keys(map || { classic: 1 })[0];
    const meta = map[tplKey] || { name: '经典图文', tagline: '' };
    const form = JSON.parse(JSON.stringify(schema.defaults[group]));

    // 点击进入模板即记一次使用（本地立即、后端异步上报，失败不影响使用）
    getApp().globalData.usage.record(group, tplKey);

    // 新 API 优先（getWindowInfo 同步返回），旧基础库回退 getSystemInfoSync
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    // 页面左右 padding 24rpx×2 + 预览容器 padding 16rpx×2（rpx → px 按 750 基准换算）
    const insets = Math.ceil(info.windowWidth / 750 * 80);
    const cw = Math.round(info.windowWidth - insets);
    const ch = Math.round(cw * 4 / 3);

    // 底部安全区（避免 calc 混合单位在真机失效，改为 JS 计算注入）
    const safeBottom = info.safeArea
      ? Math.max(info.screenHeight - info.safeArea.bottom, 0)
      : 0;

    this.setData({
      group: group,
      tplKey: tplKey,
      tplName: meta.name,
      tagline: meta.tagline,
      form: form,
      cw: cw,
      ch: ch,
      safeBottom: safeBottom,
      groupTemplates: Object.keys(map).map((key) => ({
        key: key,
        name: map[key].name,
        selected: key === tplKey
      }))
    });
    wx.setNavigationBarTitle({ title: meta.name + ' · 星风暴人物卡片生成器' });

    this.images = { main: null, a: null, b: null };
    this.renderTimer = null;
    this.canvas = null;
    this.ctx = null;
    this.logoImg = null;

    // 图片水印开关：每次进入默认关闭（不记忆）；仅记忆位置选择
    try {
      const savedMode = wx.getStorageSync('herocard-logo-wm-mode');
      this.setData({ logoMode: savedMode === 'corner' ? 'corner' : 'tile' });
    } catch (e) { /* 保持默认 */ }
  },

  onReady() {
    canvasUtil.initCanvas('#card').then((res) => {
      // 页面可能已被快速关闭（返回主页），此时放弃初始化
      if (this.unloaded || !res) return;
      this.canvas = res.canvas;
      this.ctx = res.canvas.getContext('2d');
      this.loadDefaultLogo();
      this.renderNow();
    });
  },

  /* ---------- 图片水印 ---------- */

  loadDefaultLogo() {
    // 优先级：① 用户通过「更换图片」保存的 Logo
    //        ② 构建时嵌入 JS 模块的真实 Logo（不依赖运行时包路径）
    //        ③ 内置绘制
    let dataUrl = defaultLogoDataUrl;
    try {
      const saved = wx.getStorageSync('herocard-custom-logo');
      if (saved) dataUrl = 'data:image/png;base64,' + saved;
    } catch (e) { /* 使用构建内嵌 Logo */ }

    canvasUtil.loadImage(this.canvas, dataUrl)
      .then((img) => {
        this.logoImg = img;
        this.setData({ logoSrc: dataUrl });
        this.renderNow();
      })
      .catch(() => this.useBuiltinLogo());
  },

  useBuiltinLogo() {
    this.setData({ logoSrc: 'default' });
    this.drawDefaultLogoToCanvas().then((img) => {
      this.logoImg = img;
      this.renderNow();
    }).catch(() => { /* 绘制失败不启用 */ });
  },

  /** 离屏绘制星风暴风格 Logo（深紫圆角底 + 白色五角星），返回可绘制的 Image */
  drawDefaultLogoToCanvas() {
    return new Promise((resolve, reject) => {
      try {
        const off = wx.createOffscreenCanvas ? wx.createOffscreenCanvas({ type: '2d', width: 128, height: 128 }) : null;
        if (!off) { reject(new Error('offscreen unsupported')); return; }
        const c = off.getContext('2d');
        // 深紫圆角底
        c.fillStyle = '#5d58db';
        c.beginPath();
        const r = 20, x = 4, y = 4, w = 120, h = 120;
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
        c.fill();
        // 白色描边
        c.strokeStyle = 'rgba(255,255,255,0.5)';
        c.lineWidth = 3;
        c.stroke();
        // 白色五角星
        c.fillStyle = '#ffffff';
        c.beginPath();
        const cx = 64, cy = 60, R = 30, rr = 13;
        for (let i = 0; i < 10; i += 1) {
          const rad = (-90 + i * 36) * Math.PI / 180;
          const rR = i % 2 === 0 ? R : rr;
          const px = cx + rR * Math.cos(rad);
          const py = cy + rR * Math.sin(rad);
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
        c.fill();
        // 离屏 canvas 转 data URL 再转 Image
        const dataUrl = off.toDataURL ? off.toDataURL('image/png') : '';
        if (dataUrl) {
          canvasUtil.loadImage(this.canvas, dataUrl).then(resolve).catch(reject);
        } else {
          reject(new Error('no dataURL'));
        }
      } catch (e) { reject(e); }
    });
  },

  onLogoWatermarkToggle(event) {
    const on = event.detail.value;
    this.setData({ logoWatermark: on });
    this.renderNow();
  },

  onLogoMode(event) {
    const mode = event.currentTarget.dataset.mode;
    if (mode === this.data.logoMode) return;
    this.setData({ logoMode: mode });
    try { wx.setStorageSync('herocard-logo-wm-mode', mode); } catch (e) { /* 忽略 */ }
    this.renderNow();
  },

  /** 点击缩略图放大预览 */
  onPreviewLogo() {
    const src = this.data.logoSrc;
    // 内置 Logo：从离屏 canvas 生成临时文件预览
    if (src === 'default' && this.logoImg) {
      const off = wx.createOffscreenCanvas({ type: '2d', width: 128, height: 128 });
      const c = off.getContext('2d');
      c.drawImage(this.logoImg, 0, 0, 128, 128);
      wx.canvasToTempFilePath({
        canvas: off,
        success: (res) => wx.previewImage({ urls: [res.tempFilePath] }),
        fail: () => wx.showToast({ title: '预览失败', icon: 'none' })
      });
      return;
    }
    // 自定义 Logo（data URL）：写临时文件后预览
    if (src.indexOf('data:') === 0) {
      const dest = wx.env.USER_DATA_PATH + '/logo-preview.png';
      wx.getFileSystemManager().writeFile({
        filePath: dest,
        data: src.split(',')[1],
        encoding: 'base64',
        success: () => wx.previewImage({ urls: [dest] }),
        fail: () => wx.showToast({ title: '预览失败', icon: 'none' })
      });
      return;
    }
    // 包内/临时路径：直接预览
    if (src) {
      wx.previewImage({ urls: [src] });
      return;
    }
    wx.showToast({ title: 'Logo 加载中', icon: 'none' });
  },

  onChooseLogo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        // 临时路径的 readFile 是可靠的（仅包内路径在本环境不可靠）：
        // 读为 base64 持久化到 storage，之后每次打开自动加载，无需再选。
        wx.getFileSystemManager().readFile({
          filePath: tempPath,
          encoding: 'base64',
          success: (r) => {
            try { wx.setStorageSync('herocard-custom-logo', r.data); } catch (e) { /* 忽略 */ }
            const dataUrl = 'data:image/png;base64,' + r.data;
            canvasUtil.loadImage(this.canvas, dataUrl)
              .then((img) => {
                this.logoImg = img;
                this.setData({ logoSrc: dataUrl, logoWatermark: true });
                this.renderNow();
                wx.showToast({ title: '水印图片已保存，永久生效', icon: 'none' });
              })
              .catch(() => wx.showToast({ title: '图片解码失败', icon: 'none' }));
          },
          fail: () => {
            // readFile 兜底失败：当次会话直接用临时路径
            canvasUtil.loadImage(this.canvas, tempPath)
              .then((img) => {
                this.logoImg = img;
                this.setData({ logoSrc: tempPath, logoWatermark: true });
                this.renderNow();
                wx.showToast({ title: '水印图片已更换（本次有效）', icon: 'none' });
              })
              .catch(() => wx.showToast({ title: '图片读取失败', icon: 'none' }));
          }
        });
      }
    });
  },

  /** 在 900×1200 逻辑坐标系内绘制图片水印（tile=全图平铺 / corner=左上角）
   *  尺寸对齐文字水印节奏：文字字号 44px / 纵向间距约 141，
   *  图片取 88px（2 倍字号，视觉体量与一行文字相当），间距同比例放大。 */
  drawImageWatermark(ctx, img) {
    if (this.data.logoMode === 'corner') {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.drawImage(img, 36, 36, 88, 88);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.rotate(-Math.PI / 6);
    ctx.globalAlpha = 0.12;
    const size = 88;
    const gapX = 300;
    const gapY = 200;
    for (let y = -1100; y < 2400; y += gapY) {
      for (let x = -900; x < 1900; x += gapX) {
        ctx.drawImage(img, x, y, size, size);
      }
    }
    ctx.restore();
  },

  onUnload() {
    this.unloaded = true;
    clearTimeout(this.renderTimer);
  },

  /* ---------- 数据组装（与 Web 端编辑器逻辑一致） ---------- */

  buildData() {
    const d = this.data.form;
    const themeKey = this.data.themeKey;
    if (this.data.group === 'single') {
      return {
        name: (d.name || '').trim() || '人物名称',
        role: (d.role || '').trim() || '身份标签',
        price: (d.price || '').trim() || '重点信息',
        tip: (d.tip || '').trim() || '在这里填写提示语',
        bio: (d.bio || '').trim() || '在这里填写人物介绍，让读者快速了解人物经历、特点和代表作品。',
        footer: (d.footer || '').trim() || '填写底部说明文字',
        contact: (d.contact || '').trim(),
        watermark: d.watermark || '',
        themeKey: themeKey,
        image: this.images.main,
        focusX: Number(d.focusX),
        focusY: Number(d.focusY),
        zoom: Number(d.zoom)
      };
    }
    if (this.data.group === 'compare') {
      return {
        title: (d.title || '').trim() || '代言人对比',
        tip: (d.tip || '').trim() || '报价仅供参考',
        contact: (d.contact || '').trim(),
        footer: (d.footer || '').trim() || '填写底部说明文字',
        watermark: d.watermark || '',
        themeKey: themeKey,
        imageA: this.images.a,
        imageB: this.images.b,
        zoomA: Number(d.zoomA),
        zoomB: Number(d.zoomB),
        focusYA: Number(d.focusYA),
        focusYB: Number(d.focusYB),
        nameA: (d.nameA || '').trim() || '明星 A',
        tagA: (d.tagA || '').trim() || '身份标签',
        feeA: (d.feeA || '').trim() || '出场费 面议',
        nameB: (d.nameB || '').trim() || '明星 B',
        tagB: (d.tagB || '').trim() || '身份标签',
        feeB: (d.feeB || '').trim() || '出场费 面议'
      };
    }
    if (this.data.group === 'quote') {
      const defaults = schema.defaults.quote.items;
      return {
        title: (d.title || '').trim() || '商务合作报价单',
        validity: (d.validity || '').trim() || '报价有效期：30天',
        name: (d.name || '').trim() || '明星姓名',
        tag: (d.tag || '').trim() || '身份标签',
        image: this.images.main,
        zoom: Number(d.zoom),
        focusY: Number(d.focusY),
        items: d.items.map((item, index) => ({
          name: (item.name || '').trim() || defaults[index].name,
          price: (item.price || '').trim() || '面议'
        })),
        tip: (d.tip || '').trim() || '报价备注说明',
        contact: (d.contact || '').trim(),
        footer: (d.footer || '').trim() || '填写底部说明文字',
        watermark: d.watermark || '',
        themeKey: themeKey
      };
    }
    return {
      title: (d.title || '').trim() || '明星艺人商务报价表',
      columns: [
        (d.columns[0] || '').trim() || '明星艺人',
        (d.columns[1] || '').trim() || '出场费/万',
        (d.columns[2] || '').trim() || '代表作品'
      ],
      rows: d.rows.map((row) => ({
        a: (row.a || '').trim(),
        b: (row.b || '').trim(),
        c: (row.c || '').trim()
      })),
      contact: (d.contact || '').trim(),
      footer: (d.footer || '').trim() || '填写底部说明文字',
      watermark: d.watermark || '',
      themeKey: themeKey
    };
  },

  /* ---------- 渲染 ---------- */

  renderNow() {
    if (!this.canvas || !this.ctx || this.unloaded) return;
    const app = getApp();
    const env = app.globalData.env;
    this.renderTemplateTo(env.get(), env.helpers(), this.data.tplKey);
  },

  /** 用当前配置渲染指定模板到画布（供预览与批量生成复用） */
  renderTemplateTo(registry, helpers, tplKey) {
    const template = registry[this.data.group][tplKey];
    if (!template) return;

    const parts = this.data.sizeKey.split('x');
    const w = Number(parts[0]);
    const h = Number(parts[1]);
    this.canvas.width = w;
    this.canvas.height = h;

    const ctx = this.ctx;
    const scale = w / 900;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    helpers.setDrawingContext(ctx);
    if (helpers.consumeBioOverflow) helpers.consumeBioOverflow();
    ctx.clearRect(0, 0, 900, 1200);
    template.render(ctx, this.buildData(), helpers);
    if (this.data.logoWatermark && this.logoImg) {
      this.drawImageWatermark(ctx, this.logoImg);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  },

  scheduleRender() {
    clearTimeout(this.renderTimer);
    this.renderTimer = setTimeout(() => this.renderNow(), RENDER_DEBOUNCE);
  },

  /* ---------- 表单 ---------- */

  onField(event) {
    const field = event.currentTarget.dataset.field;
    this.data.form[field] = event.detail.value;
    this.scheduleRender();
  },

  onSlider(event) {
    const field = event.currentTarget.dataset.field;
    const value = Number(event.detail.value);
    this.data.form[field] = value;
    this.setData({ ['form.' + field]: value });
    this.scheduleRender();
  },

  onTheme(event) {
    this.setData({ themeKey: event.currentTarget.dataset.key });
    this.scheduleRender();
  },

  onSize(event) {
    const idx = Number(event.detail.value);
    const option = schema.sizeOptions[idx];
    this.setData({
      sizeKey: option.key,
      sizeLabel: option.key.split('x').join(' × ')
    });
    this.renderNow();
  },

  /* ---------- 照片 ---------- */

  choosePhoto(slot) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        canvasUtil.loadImage(this.canvas, tempPath).then((image) => {
          const fit = canvasUtil.smartFit(image);
          if (slot === 'a') {
            this.images.a = image;
            this.data.form.zoomA = fit.zoom;
            this.data.form.focusYA = fit.focusY;
            this.setData({ hasPhotoA: true, 'form.zoomA': fit.zoom, 'form.focusYA': fit.focusY });
          } else if (slot === 'b') {
            this.images.b = image;
            this.data.form.zoomB = fit.zoom;
            this.data.form.focusYB = fit.focusY;
            this.setData({ hasPhotoB: true, 'form.zoomB': fit.zoom, 'form.focusYB': fit.focusY });
          } else {
            this.images.main = image;
            this.data.form.zoom = fit.zoom;
            this.data.form.focusY = fit.focusY;
            this.setData({ hasPhoto: true, 'form.zoom': fit.zoom, 'form.focusY': fit.focusY });
          }
          this.renderNow();
        }).catch(() => {
          wx.showToast({ title: '图片读取失败', icon: 'none' });
        });
      }
    });
  },

  onChoosePhoto() { this.choosePhoto('main'); },
  onChoosePhotoA() { this.choosePhoto('a'); },
  onChoosePhotoB() { this.choosePhoto('b'); },

  /* ---------- 报价项目 ---------- */

  onItemField(event) {
    const { ii, fi } = event.currentTarget.dataset;
    this.data.form.items[Number(ii)][fi] = event.detail.value;
    this.scheduleRender();
  },

  /* ---------- 批量行 ---------- */

  onRowField(event) {
    const { ri, fi } = event.currentTarget.dataset;
    this.data.form.rows[Number(ri)][fi] = event.detail.value;
    this.scheduleRender();
  },

  onColumnField(event) {
    const ci = Number(event.currentTarget.dataset.ci);
    this.data.form.columns[ci] = event.detail.value;
    this.scheduleRender();
  },

  addRow() {
    if (this.data.form.rows.length >= 16) {
      wx.showToast({ title: '最多 16 行', icon: 'none' });
      return;
    }
    this.data.form.rows.push({ a: '', b: '', c: '' });
    this.setData({ 'form.rows': this.data.form.rows });
    this.scheduleRender();
  },

  removeRow(event) {
    const ri = Number(event.currentTarget.dataset.ri);
    if (this.data.form.rows.length <= 4) {
      wx.showToast({ title: '至少保留 4 行', icon: 'none' });
      return;
    }
    this.data.form.rows.splice(ri, 1);
    this.setData({ 'form.rows': this.data.form.rows });
    this.scheduleRender();
  },

  /* ---------- 批量生成 ---------- */

  onToggleTpl(event) {
    const key = event.currentTarget.dataset.key;
    const target = this.data.groupTemplates.find((t) => t.key === key);
    const turningOn = target && !target.selected;
    const list = this.data.groupTemplates.map((t) => (
      t.key === key ? { key: t.key, name: t.name, selected: !t.selected } : t
    ));
    this.setData({ groupTemplates: list });
    // 勾选即视为使用一次：立即计入（本地 + 后端异步上报）
    if (turningOn) {
      try { getApp().globalData.usage.record(this.data.group, key); } catch (e) { /* 忽略 */ }
    }
  },

  /* ---------- 保存与分享 ---------- */

  onSave() {
    if (!this.canvas) return;
    const selected = this.data.groupTemplates.filter((t) => t.selected);
    if (!selected.length) {
      wx.showToast({ title: '请至少选择一个模板', icon: 'none' });
      return;
    }

    // 仅当前模板：走原有单张保存
    if (selected.length === 1 && selected[0].key === this.data.tplKey) {
      this.renderNow();
      wx.showLoading({ title: '正在保存', mask: true });
      canvasUtil.saveToAlbum(this.canvas).then(() => {
        wx.hideLoading();
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      }).catch(() => {
        wx.hideLoading();
      });
      return;
    }

    // 多个模板：同一配置逐个渲染并保存
    this.saveBatch(selected);
  },

  saveBatch(selected) {
    const app = getApp();
    const env = app.globalData.env;
    const registry = env.get();
    const helpers = env.helpers();
    const total = selected.length;

    wx.showLoading({ title: '正在保存 1/' + total, mask: true });

    const run = (i) => {
      if (i >= total) {
        wx.hideLoading();
        wx.showToast({ title: total + ' 张卡片已保存', icon: 'success' });
        this.renderNow();
        return Promise.resolve();
      }
      // 使用计数已在勾选时计入（onToggleTpl），此处不再重复计数
      return this.renderAndSave(registry, helpers, selected[i].key).then(() => {
        if (i < total - 1) {
          wx.showLoading({ title: '正在保存 ' + (i + 2) + '/' + total, mask: true });
        }
        return run(i + 1);
      });
    };

    run(0).catch((err) => {
      wx.hideLoading();
      const denied = err && err.errMsg && err.errMsg.indexOf('auth') > -1;
      if (!denied) {
        wx.showToast({ title: '保存中断，请重试', icon: 'none' });
      }
      this.renderNow();
    });
  },

  /** 渲染指定模板并保存到相册，返回 Promise */
  renderAndSave(registry, helpers, tplKey) {
    this.renderTemplateTo(registry, helpers, tplKey);
    return canvasUtil.toTempFile(this.canvas).then((tempPath) => new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: tempPath,
        success: resolve,
        fail: (err) => {
          const denied = err && err.errMsg && err.errMsg.indexOf('auth') > -1;
          if (denied) {
            wx.hideLoading();
            wx.showModal({
              title: '需要相册权限',
              content: '请在设置中开启「保存到相册」权限后重试',
              confirmText: '去设置',
              success: (r) => { if (r.confirm) wx.openSetting(); }
            });
          }
          reject(err);
        }
      });
    }));
  },

  onShareAppMessage() {
    return {
      title: '星风暴人物卡片生成器 · ' + this.data.tplName,
      path: '/pages/editor/editor?g=' + this.data.group + '&t=' + this.data.tplKey
    };
  },

  onShareTimeline() {
    return {
      title: '星风暴人物卡片生成器 · ' + this.data.tplName,
      query: 'g=' + this.data.group + '&t=' + this.data.tplKey
    };
  }
});
