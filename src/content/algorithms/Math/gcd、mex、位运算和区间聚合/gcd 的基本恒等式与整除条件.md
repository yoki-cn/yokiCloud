---
kind: algorithm
title: gcd 的基本恒等式与整除条件
updated: 2026-10-12
status: draft
order: 1110100
tags:
  - 数论
  - 位运算
  - 区间统计
---

约定 $\gcd(a,b)\ge0$，且 $\gcd(0,a)=|a|,\ \gcd(0,0)=0$。


$$
\gcd(a,b)=\gcd(a,b-qa),\qquad\gcd(ka,kb)=|k|\gcd(a,b),
$$


$$
\gcd(a,b)\operatorname{lcm}(a,b)=|ab|\quad(a,b\ne0),
$$


$$
v_p(\gcd(a,b))=\min(v_p(a),v_p(b)),\quad v_p(\operatorname{lcm}(a,b))=\max(v_p(a),v_p(b)).
$$


$\gcd(a_1,\ldots,a_t)=1$ 不等价于存在两个互质元素：例如 $6,10,15$ 整体互质而任意两者 gcd 都大于 $1$。
