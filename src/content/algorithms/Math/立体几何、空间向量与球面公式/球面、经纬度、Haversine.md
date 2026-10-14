---
kind: algorithm
title: 球面、经纬度、Haversine
updated: 2026-10-12
status: draft
order: 1080900
tags:
  - 立体几何
---

经纬度 $\phi,\lambda$ 都使用**弧度**。球面单位向量：


$$
u=(\cos\phi\cos\lambda,\cos\phi\sin\lambda,\sin\phi).
$$


两点圆心角 $\theta\in[0,\pi]$：


$$
\cos\theta=\sin\phi_1\sin\phi_2+\cos\phi_1\cos\phi_2\cos(\lambda_2-\lambda_1),
$$


$$
\sin^2\frac\theta2=\sin^2\frac{\phi_2-\phi_1}2+\cos\phi_1\cos\phi_2\sin^2\frac{\lambda_2-\lambda_1}2.
$$


球半径 $R$：大圆最短弧长 $R\theta$，空间直线弦长 $2R\sin(\theta/2)$。地理距离近似通常默认地球是球体；对高精度测地线需椭球模型。
