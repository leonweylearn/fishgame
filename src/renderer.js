export function drawBackground(ctx, width, height) {
  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, '#001830');
  g.addColorStop(1, '#000810');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

export function drawFish(ctx, x, y, radius, angle, color, glow = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
  }

  ctx.fillStyle = color;

  // Tail
  ctx.beginPath();
  ctx.moveTo(-radius * 0.75, 0);
  ctx.lineTo(-radius * 1.5, -radius * 0.55);
  ctx.lineTo(-radius * 1.5,  radius * 0.55);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye white
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(radius * 0.42, -radius * 0.12, radius * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Eye pupil
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(radius * 0.47, -radius * 0.12, radius * 0.11, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawUI(ctx, score, playerRadius, width) {
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`分数: ${score}`, 20, 38);
  ctx.font = '15px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(`体型: ${Math.round(playerRadius)}`, 20, 60);
}

export function drawStartScreen(ctx, width, height) {
  ctx.fillStyle = 'rgba(0,10,30,0.75)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.fillText('大鱼吃小鱼', width / 2, height / 2 - 60);

  ctx.font = '22px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText('用方向键或 WASD 控制大鱼移动', width / 2, height / 2 + 5);
  ctx.fillText('只能吃比自己小的鱼，被大鱼碰到则游戏结束', width / 2, height / 2 + 38);

  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillStyle = '#4fc3f7';
  ctx.fillText('按任意键开始', width / 2, height / 2 + 100);
}

export function drawGameOverScreen(ctx, score, width, height) {
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.fillText('游戏结束', width / 2, height / 2 - 55);

  ctx.fillStyle = '#ffd54f';
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.fillText(`最终分数: ${score}`, width / 2, height / 2 + 5);

  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillStyle = '#4fc3f7';
  ctx.fillText('按任意键重新开始', width / 2, height / 2 + 75);
}
