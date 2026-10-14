---
kind: algorithm
title: Abel 恒等式与 Lambert $W$
updated: 2026-10-12
status: draft
order: 1021100
tags:
  - 生成函数
  - 多项式
  - 群论
---

Abel 多项式 $A_n(x;a)=x(x-na)^{n-1}$（$n\ge1$，$A_0=1$），其二项式型恒等式为


$$
A_n(x+y;a)=\sum_{k=0}^n\binom nk A_k(x;a)A_{n-k}(y;a).
$$


解析形式的 Lambert $W$ 满足 $W(z)e^{W(z)}=z$，在 $0$ 附近有


$$
W(z)=\sum_{n\ge1}\frac{(-n)^{n-1}}{n!}z^n.
$$


该级数也可作为形式幂级数理解，说明 Cayley 型有根树计数与 Lagrange 反演的联系。
