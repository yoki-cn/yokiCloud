---
kind: algorithm
title: 三次方程 Cardano 公式与四次方程 Ferrari 分解
updated: 2026-10-12
status: draft
order: 1131400
tags:
  - 高阶代数
  - 图论
  - 组合数学
---

**三次方程**：$ax^3+bx^2+cx+d=0\ (a\ne0)$，作平移 $x=y-b/(3a)$，得到 $y^3+py+q=0$，其中


$$
p=\frac ca-\frac{b^2}{3a^2},\qquad q=\frac{2b^3}{27a^3}-\frac{bc}{3a^2}+\frac da,\qquad\Delta=\left(\frac q2\right)^2+\left(\frac p3\right)^3.
$$


当 $\Delta\ge0$，取**实数立方根** $\sqrt[3]{\ \cdot\ }$，一个实根为


$$
\boxed{x=\sqrt[3]{-q/2+\sqrt\Delta}+\sqrt[3]{-q/2-\sqrt\Delta}-\frac b{3a}.}
$$


若 $\Delta=0$，存在重根；$p=q=0$ 时只有三重根 $x=-b/(3a)$。当 $\Delta<0$，有三个互异实根，且 $p<0$：


$$
\theta=\frac13\arccos\!\left(\frac{3q}{2p}\sqrt{-\frac3p}\right),\quad\boxed{x_k=2\sqrt{-\frac p3}\cos\left(\theta-\frac{2\pi k}3\right)-\frac b{3a},\quad k=0,1,2.}
$$


**四次方程**：一般式除以首项系数并平移可化为 $y^4+py^2+qy+r=0$。若 $q=0$，令 $z=y^2$，直接解 $z^2+pz+r=0$；若 $q\ne0$，取以下三次预解方程的任意**正实根** $s>0$：


$$
\boxed{s^3+2ps^2+(p^2-4r)s-q^2=0.}
$$


令 $h=\sqrt s$，则有严格恒等式


$$
\boxed{y^4+py^2+qy+r=\left(y^2+hy+\frac{p+s-q/h}2\right)\left(y^2-hy+\frac{p+s+q/h}2\right).}
$$


因此分解后各解一个二次方程即可得所有复根，再筛出实根。$q\ne0$ 时预解方程在 $s=0$ 为负、$s\to+\infty$ 为正，所以确有正实根；$q=0$ 时不可写 $q/h$。原方程退化为低次数时必须单独处理首项系数为零。
