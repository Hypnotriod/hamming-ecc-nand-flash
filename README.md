# hamming-ecc-nand-flash
Software test implementation of `Hamming Error Correction Code` algorithm for `NAND Flash` memory with `JavaScript`

## Implementation example of 8 bits data encoding
Redundant bits number of evens and odds = `ceil(log2(data_bits))`
ECC size = `even_bits + odd_bits`
```text
Redundant bit index | Partitions
     (even and odd) | even            | odd
                  0 | {0 ^ 2 ^ 4 ^ 6} | {1 ^ 3 ^ 5 ^ 7} | take 1 skip 1
				  1 | {0 ^ 1 ^ 4 ^ 5} | {2 ^ 3 ^ 6 ^ 7} | take 2 skip 2
				  2 | {0 ^ 1 ^ 2 ^ 3} | {4 ^ 5 ^ 6 ^ 7} | take 4 skip 4
```
For NAND Flash memory final grouping of redundant even and odd bits of ECC code is:
```text
{odd2, even2, odd1, even1, odd0, even0}
```
