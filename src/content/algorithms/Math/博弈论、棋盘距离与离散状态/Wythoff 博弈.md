---
kind: algorithm
title: Wythoff 博弈
updated: 2026-10-12
status: draft
order: 1100400
tags:
  - 博弈论
---

两堆石子 $(a,b)$，每次可以从一堆移除任意正数，或从两堆移除**相同**正数；$(0,0)$ 为终局。令 $a\le b$，$k\ge0$，黄金比例 $\varphi=(1+\sqrt5)/2$，其全部必败态为


$$
\boxed{(a_k,b_k)=\left(\lfloor k\varphi\rfloor,\lfloor k\varphi^2\rfloor\right),\qquad b_k=a_k+k.}
$$


对一般输入先计算 $k=b-a$，再检查 $a=\lfloor k\varphi\rfloor$。浮点计算超大整数时可能产生取整误差，应使用整数精确比较。
