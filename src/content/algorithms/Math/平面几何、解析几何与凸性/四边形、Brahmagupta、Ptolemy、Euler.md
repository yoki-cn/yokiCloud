---
kind: algorithm
title: 四边形、Brahmagupta、Ptolemy、Euler
updated: 2026-10-12
status: draft
order: 1070900
tags:
  - 平面几何
---

凸四边形四边 $a,b,c,d$（顺序），对角线 $p,q$，其夹角 $\theta$，面积


$$
S=\frac12pq|\sin\theta|.
$$


**Bretschneider**（任意凸四边形、相对角 $A,C$，$s=(a+b+c+d)/2$）：


$$
S^2=(s-a)(s-b)(s-c)(s-d)-abcd\cos^2\frac{A+C}{2}.
$$


若四点共圆，则 $A+C=\pi$，得到 **Brahmagupta** $S=\sqrt{(s-a)(s-b)(s-c)(s-d)}$，**Ptolemy** $pq=ac+bd$。

四边形两条对角线中点距离 $m$，Euler 四边形定理


$$
a^2+b^2+c^2+d^2=p^2+q^2+4m^2.
$$
