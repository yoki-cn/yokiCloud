---
kind: algorithm
title: 结式（resultant）与判别式
updated: 2026-10-12
status: draft
order: 1130800
tags:
  - 高阶代数
  - 图论
  - 组合数学
---

设 $f(x)=a_m\prod_{i=1}^m(x-\alpha_i)$、$g(x)=b_n\prod_{j=1}^n(x-\beta_j)$，其中 $a_m,b_n\ne0$，在公共分裂域中


$$
\operatorname{Res}(f,g)=a_m^n\prod_{i=1}^m g(\alpha_i)=(-1)^{mn}b_n^m\prod_{j=1}^n f(\beta_j),
$$


$$
\operatorname{Res}(f,g)=0\iff f,g\text{ 存在公共根},
$$


$$
\operatorname{Disc}(f)=a_m^{2m-2}\prod_{i<j}(\alpha_i-\alpha_j)^2=(-1)^{m(m-1)/2}a_m^{-1}\operatorname{Res}(f,f').
$$


结式是 Sylvester 矩阵的行列式。对二次式 $ax^2+bx+c$：$\operatorname{Disc}(f)=b^2-4ac$；判别式为零等价于在代数闭包有重根。
