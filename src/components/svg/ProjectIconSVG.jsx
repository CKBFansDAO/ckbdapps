import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

let starryBackground = './images/starry-bg.jpeg';
let nervosLogo = './images/nervos-logo-white.svg'

const ProjectIconsSVG = ({ icons }) => {
  const svgRef = useRef(null);

  console.log(icons)

  const canvasWidth = 1620;
  const canvasHeight = 880;
  const starRadius = 28;

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    
    const radius1 = 230; // 轨道1的半径
    const radius2 = 320; // 轨道2的半径
    const radius3 = 420; // 轨道3的半径
    const radius4 = 540; // 轨道4的半径
    const radius5 = 670; // 轨道5的半径
    const radius1Count = icons.length > 14 ? 14 : icons.length; // 轨道图标的数量
    const radius2Count = (icons.length - radius1Count) > 20 ? 20 : (icons.length - radius1Count); // 圆上图标的数量
    const radius3Count = (icons.length - radius1Count - radius2Count) > 25 ? 25 : (icons.length - radius1Count - radius2Count); // 圆上图标的数量
    const radius4Count = (icons.length - radius1Count - radius2Count - radius3Count) > 30 ? 30 : (icons.length - radius1Count - radius2Count - radius3Count); // 圆上图标的数量

    // 添加星空背景图
    svgElement.style('background-image', `url(${starryBackground})`)
      .style('background-size', 'cover')
      .style('background-position', 'center center');

    const circles = [
      { radius: radius1, stroke: '#631BA7', strokeWidth: '2', fill: 'none',strokeDasharray:"5,2" },
      { radius: radius2, stroke: '#360E7B', strokeWidth: '4', fill: 'none',strokeDasharray:"5,2" },
      { radius: radius3, stroke: '#322C3E', strokeWidth: '0', fill: 'none' },
      { radius: radius4, stroke: '#ffffff', strokeWidth: '0', fill: 'none' },
      { radius: radius5, stroke: '#ffffff', strokeWidth: '0', fill: 'none' }
    ];

    svgElement
      .selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cx', canvasWidth / 2)
      .attr('cy', canvasHeight / 2)
      .attr('r', (d) => d.radius)
      .attr('stroke', (d) => d.stroke)
      .attr('stroke-width', (d) => d.strokeWidth)
      .attr('stroke-dasharray',(d) => d.strokeDasharray)
      .attr('fill', (d) => d.fill);

    const stars = [];

    // 在第一个圆的轨道上绘制图标
    const angle1 = (2 * Math.PI) / radius1Count;
    for (let i = 0; i < radius1Count; i++) {
      const angle = i * angle1;
      const x = canvasWidth / 2 + radius1 * Math.cos(angle);
      const y = canvasHeight / 2 + radius1 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: starRadius, orbitalRadius: radius1, v: 0.00045, angle, icon, direction: -1 });
    }

    // 在第二个圆的轨道上绘制图标
    const angle2 = (2 * Math.PI) / radius2Count;
    for (let i = 0; i < radius2Count; i++) {
      const angle = i * angle2;
      const x = canvasWidth / 2 + radius2 * Math.cos(angle);
      const y = canvasHeight / 2 + radius2 * Math.sin(angle);
      const icon = icons[radius1Count + i];
      stars.push({ x, y, radius: starRadius, orbitalRadius: radius2, v: 0.00025, angle, icon, direction: 1 });
    }

    // 在第三个圆的轨道上绘制图标
    const angle3 = (2 * Math.PI) / radius3Count;
    for (let i = 0; i < radius3Count; i++) {
      const angle = i * angle3;
      const x = canvasWidth / 2 + radius3 * Math.cos(angle);
      const y = canvasHeight / 2 + radius3 * Math.sin(angle);
      const icon = icons[radius1Count + radius2Count + i];
      stars.push({ x, y, radius: starRadius, orbitalRadius: radius3, v: 0.00015, angle, icon, direction: -1 });
    }

    // 在第4个圆的轨道上绘制图标
    const angle4 = (2 * Math.PI) / radius4Count;
    for (let i = 0; i < radius4Count; i++) {
      const angle = i * angle4;
      const x = canvasWidth / 2 + radius4 * Math.cos(angle);
      const y = canvasHeight / 2 + radius4 * Math.sin(angle);
      const icon = icons[radius1Count + radius2Count + radius3Count + i];
      stars.push({ x, y, radius: starRadius, orbitalRadius: radius4, v: 0.00015, angle, icon, direction: 1 });
    }

    // 在最外面的圆形轨道上绘制剩余的图标
    for (let i = radius1Count + radius2Count + radius3Count + radius4Count; i < icons.length; i++) {
      const angle = (2 * Math.PI * (i - radius1Count - radius2Count - radius3Count - radius4Count)) / (icons.length - radius1Count - radius2Count - radius3Count - radius4Count);
      const x = canvasWidth / 2 + radius4 * Math.cos(angle);
      const y = canvasHeight / 2 + radius4 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: starRadius, orbitalRadius: radius5, v: 0.00010, angle, icon, direction: -1 });
    }

    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (event) {
        const iconData = d3.select(this).data()[0]; // 获取图标数据对象
        return `<span>${iconData.icon.name}</span>`;
      })
      .style('color', 'white') // 设置文本颜色为白色
      .style('background-color', 'rgba(0, 0, 0, 0.6)') // 设置背景颜色为透明黑色
      .style('padding', '4px 8px') // 设置内边距
      .style('border-radius', '4px') // 设置圆角
      .style('font-family', "'Space Grotesk','Space Mono','JetBrains Mono'")  //设置字体
      .style('font-size', '14px') // 设置字体大小
      .style('font-weight','bold')

    const nodes = svgElement
      .selectAll('.node')
      .data(stars)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .on('click', (event, d) => {
        if (d.icon.url?.length > 0) {
          window.open(d.icon.url)
        }})
      .call(tip); // 在创建节点时调用tip

    nodes
      .append('clipPath')
      .attr('id', (d, i) => `clip-${i}`)
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('cx', 0)
      .attr('cy', 0);

    nodes
      .append('image')
      .attr('href', (d) => d.icon.icon)
      .attr('width', (d) => d.radius * 2)
      .attr('height', (d) => d.radius * 2)
      .attr('x', (d) => -d.radius)
      .attr('y', (d) => -d.radius)
      .attr('clip-path', (d, i) => `url(#clip-${i})`)
      .style('animation', (d) => `blink ${d.duration}s ease-in-out ${d.delay}s infinite alternate`)
      .on('mouseover', function (event, d) {
        d3.select(this).style('filter', 'url(#glow)'); // 鼠标悬停时添加光晕效果
        tip.show.call(this, event, d); // 显示提示框
        const glow = d3.select(this).select('.glow'); // 获取光晕元素
        glow.transition()
          .duration(200)
          .attr('transform', `translate(${event.offsetX}, ${event.offsetY})`); // 将光晕元素移动到鼠标位置
      })
      .on('mouseout', function (event, d) {
        d3.select(this).style('filter', null); // 鼠标离开时移除光晕效果
        tip.hide.call(this, event, d); // 隐藏提示框
      })
      .style('cursor', 'pointer');

    const style = svgElement.append('style');
    style.text(`
      @keyframes blink {
        0% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `);

    nodes.datum(function (d) {
      return d; // 绑定图标数据到元素上
    });

    const defs = svgElement.append('defs');

    const filter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter
      .append('feGaussianBlur')
      .attr('class', 'blur')
      .attr('stdDeviation', '5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const animate = () => {
      nodes.attr('transform', (d) => {
        const x = canvasWidth / 2 + d.orbitalRadius * Math.cos(d.angle);
        const y = canvasHeight / 2 + d.orbitalRadius * Math.sin(d.angle);
        d.angle += d.direction * d.v;//0.00015;
        return `translate(${x}, ${y}) rotate(${24 * d.angle * (180 / Math.PI)})`; // 同时更新自转角度，公转1圈，自转24圈
      });
      requestAnimationFrame(animate);
    };

    animate();
  }, [icons]);
  return <svg ref={svgRef} viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
    <image
        xlinkHref={nervosLogo}
        width={200}
        height={null}
        x={canvasWidth / 2 - 100 + 20}
        y={canvasHeight / 2 - 66-20}
        preserveAspectRatio="xMidYMid meet"
      />
  </svg>;
};

export default ProjectIconsSVG;



/*
以下代码实现了光晕效果的添加和移除，并在鼠标悬停时显示提示框，鼠标离开时隐藏提示框。不过光晕效果跟我想象中的有点差距
const ProjectIconsSVG = ({ icons }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    const width = 1620;
    const height = 880;

    const radius1 = 230; // 轨道1的半径
    const radius2 = 310; // 轨道2的半径
    const radius3 = 400; // 轨道3的半径
    const radius1Count = 5; // 轨道图标的数量
    const radius2Count = 8; // 圆上图标的数量

    // 添加星空背景图
    svgElement.style('background-image', `url(${starryBackground})`).style('background-size', 'cover');

    const circles = [
      { radius: radius1, stroke: '#322C3E', strokeWidth: '1', fill: 'none' },
      { radius: radius2, stroke: '#aa0000', strokeWidth: '2', fill: 'none' },
      { radius: radius3, stroke: '#322C3E', strokeWidth: '1', fill: 'none' },
    ];

    svgElement
      .selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', (d) => d.radius)
      .attr('stroke', (d) => d.stroke)
      .attr('stroke-width', (d) => d.strokeWidth)
      .attr('fill', (d) => d.fill);

    const starCount = icons.length; // 星星的数量，与图标列表长度相同
    const maxRadius = Math.min(width, height) / 20; // 星星的最大半径

    const stars = [];

    // 在半径为400的圆上绘制图标
    const angle1 = (2 * Math.PI) / radius1Count;
    for (let i = 0; i < radius1Count; i++) {
      const angle = i * angle1;
      const x = width / 2 + radius1 * Math.cos(angle);
      const y = height / 2 + radius1 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius1, angle, icon, direction: -1 });
    }

    // 在半径为310的圆上绘制图标
    const angle2 = (2 * Math.PI) / radius2Count;
    for (let i = 0; i < radius2Count; i++) {
      const angle = i * angle2;
      const x = width / 2 + radius2 * Math.cos(angle);
      const y = height / 2 + radius2 * Math.sin(angle);
      const icon = icons[radius1Count + i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius2, angle, icon, direction: 1 });
    }

    // 在半径为230的圆上绘制剩余的图标
    for (let i = radius1Count + radius2Count; i < icons.length; i++) {
      const angle = (2 * Math.PI * (i - radius1Count - radius2Count)) / (icons.length - radius1Count - radius2Count);
      const x = width / 2 + radius3 * Math.cos(angle);
      const y = height / 2 + radius3 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius3, angle, icon, direction: -1 });
    }

    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (event) {
        const iconData = d3.select(this).data()[0]; // 获取图标数据对象
        return `<span>${iconData.icon.name}</span>`;
      })
      .style('color', 'white') // 设置文本颜色为白色
      .style('background-color', 'rgba(0, 0, 0, 0.8)'); // 设置背景颜色为透明黑色

    const nodes = svgElement
      .selectAll('.node')
      .data(stars)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .on('click', (event, d) => window.open(d.icon.url))
      .call(tip); // 在创建节点时调用tip

    nodes
      .append('clipPath')
      .attr('id', (d, i) => `clip-${i}`)
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('cx', 0)
      .attr('cy', 0);

    nodes
      .append('image')
      .attr('href', (d) => d.icon.icon)
      .attr('width', (d) => d.radius * 2)
      .attr('height', (d) => d.radius * 2)
      .attr('x', (d) => -d.radius)
      .attr('y', (d) => -d.radius)
      .attr('clip-path', (d, i) => `url(#clip-${i})`)
      .style('animation', (d) => `blink ${d.duration}s ease-in-out ${d.delay}s infinite alternate`)
      .on('mouseover', function (event, d) {
        d3.select(this).style('filter', 'url(#glow)'); // 鼠标悬停时添加光晕效果
        tip.show.call(this, event, d); // 显示提示框
      })
      .on('mouseout', function (event, d) {
        d3.select(this).style('filter', null); // 鼠标离开时移除光晕效果
        tip.hide.call(this, event, d); // 隐藏提示框
      })
      .style('cursor', 'pointer');

    const style = svgElement.append('style');
    style.text(`
      @keyframes blink {
        0% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `);

    nodes.datum(function (d) {
      return d; // 绑定图标数据到元素上
    });

    const defs = svgElement.append('defs');

    const filter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter
      .append('feGaussianBlur')
      .attr('class', 'blur')
      .attr('stdDeviation', '5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const animate = () => {
      nodes.attr('transform', (d) => {
        const x = width / 2 + d.orbitalRadius * Math.cos(d.angle);
        const y = height / 2 + d.orbitalRadius * Math.sin(d.angle);
        d.angle += d.direction * 0.00015;
        return `translate(${x}, ${y}) rotate(${24 * d.angle * (180 / Math.PI)})`; // 同时更新自转角度，公转1圈，自转24圈
      });
      requestAnimationFrame(animate);
    };

    animate();
  }, [icons]);
  return <svg ref={svgRef} viewBox="0 0 1620 880"></svg>;
};

export default ProjectIconsSVG;
*/


/*
const ProjectIconsSVG = ({ icons }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    const width = 1620;
    const height = 880;

    const radius1 = 230;    // 轨道1的半径
    const radius2 = 310;    // 轨道2的半径
    const radius3 = 400;    // 轨道3的半径
    const radius1Count = 5; // 轨道图标的数量
    const radius2Count = 8; // 圆上图标的数量

    // 添加星空背景图
    svgElement.style('background-image', `url(${starryBackground})`)
      .style('background-size','cover');

    const circles = [
      { radius: radius1, stroke: '#322C3E', strokeWidth: '1', fill: 'none' },
      { radius: radius2, stroke: '#aa0000', strokeWidth: '2', fill: 'none' },
      { radius: radius3, stroke: '#322C3E', strokeWidth: '1', fill: 'none' },
    ];

    svgElement
      .selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', (d) => d.radius)
      .attr('stroke', (d) => d.stroke)
      .attr('stroke-width', (d) => d.strokeWidth)
      .attr('fill', (d) => d.fill);

    const starCount = icons.length; // 星星的数量，与图标列表长度相同
    const maxRadius = Math.min(width, height) / 20; // 星星的最大半径

    const stars = [];

    // 在半径为400的圆上绘制图标
    const angle1 = (2 * Math.PI) / radius1Count;
    for (let i = 0; i < radius1Count; i++) {
      const angle = i * angle1;
      const x = width / 2 + radius1 * Math.cos(angle);
      const y = height / 2 + radius1 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius1, angle, icon, direction: -1 });
    }

    // 在半径为310的圆上绘制图标
    const angle2 = (2 * Math.PI) / radius2Count;
    for (let i = 0; i < radius2Count; i++) {
      const angle = i * angle2;
      const x = width / 2 + radius2 * Math.cos(angle);
      const y = height / 2 + radius2 * Math.sin(angle);
      const icon = icons[radius1Count + i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius2, angle, icon, direction: 1 });
    }

    // 在半径为230的圆上绘制剩余的图标
    for (let i = radius1Count + radius2Count; i < icons.length; i++) {
      const angle = (2 * Math.PI * (i - radius1Count - radius2Count)) / (icons.length - radius1Count - radius2Count);
      const x = width / 2 + radius3 * Math.cos(angle);
      const y = height / 2 + radius3 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius3, angle, icon, direction: -1 });
    }

    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (event) {
        const iconData = d3.select(this).data()[0]; // 获取图标数据对象
        console.log(iconData); // 打印图标数据对象
        return `<span>${iconData.icon.name}</span>`;
      })
      .style('color', 'white') // 设置文本颜色为白色
      .style('background-color', 'rgba(0, 0, 0, 0.8)'); // 设置背景颜色为透明黑色

      const nodes = svgElement
      .selectAll('.node')
      .data(stars)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .on('click', (event, d) => window.open(d.icon.url))
      .call(tip); // 在创建节点时调用tip
    
    nodes
      .append('clipPath')
      .attr('id', (d, i) => `clip-${i}`)
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('cx', 0)
      .attr('cy', 0);
    
    nodes
      .append('image')
      .attr('href', (d) => d.icon.icon)
      .attr('width', (d) => d.radius * 2)
      .attr('height', (d) => d.radius * 2)
      .attr('x', (d) => -d.radius)
      .attr('y', (d) => -d.radius)
      .attr('clip-path', (d, i) => `url(#clip-${i})`)
      .style('animation', (d) => `blink ${d.duration}s ease-in-out ${d.delay}s infinite alternate`)
      .on('mouseover', tip.show) // 当鼠标悬停时显示光晕效果
      .on('mouseout', tip.hide) // 当鼠标离开时隐藏光晕效果
      .style('filter', 'url(#glow)'); // 添加光晕效果

    const style = svgElement.append('style');
    style.text(`
      @keyframes blink {
        0% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `);

    nodes
      .datum(function (d) {
        return d; // 绑定图标数据到元素上
      })
      .call(tip);

    nodes
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style('cursor', 'pointer');

    const defs = svgElement.append('defs');

    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('class', 'blur')
      .attr('stdDeviation', '5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const animate = () => {
      nodes.attr('transform', (d) => {
        const x = width / 2 + d.orbitalRadius * Math.cos(d.angle);
        const y = height / 2 + d.orbitalRadius * Math.sin(d.angle);
        d.angle += d.direction * 0.00015;
        return `translate(${x}, ${y}) rotate(${24 * d.angle * (180 / Math.PI)})`; // 同时更新自转角度，公转1圈，自转24圈
      });
      requestAnimationFrame(animate);
    };

    animate();
  }, [icons]);

  return <svg ref={svgRef} viewBox="0 0 1620 880"></svg>;
};

export default ProjectIconsSVG;
/*
const ProjectIconsSVG = ({ icons }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    const width = 1620;
    const height = 880;

    const radius1 = 230;    // 轨道1的半径
    const radius2 = 310;    // 轨道2的半径
    const radius3 = 400;    // 轨道3的半径
    const radius1Count = 5; // 轨道图标的数量
    const radius2Count = 8; // 圆上图标的数量

    // 添加星空背景图
    svgElement.style('background-image', `url(${starryBackground})`)
      .style('background-size','cover');

    const circles = [
      { radius: radius1, stroke: '#322C3E', strokeWidth: '1', fill: 'none' },
      { radius: radius2, stroke: '#aa0000', strokeWidth: '2', fill: 'none' },
      { radius: radius3, stroke: '#322C3E', strokeWidth: '1', fill: 'none' },
    ];

    svgElement
      .selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', (d) => d.radius)
      .attr('stroke', (d) => d.stroke)
      .attr('stroke-width', (d) => d.strokeWidth)
      .attr('fill', (d) => d.fill);

    const starCount = icons.length; // 星星的数量，与图标列表长度相同
    const maxRadius = Math.min(width, height) / 20; // 星星的最大半径

    const stars = [];

    // 在半径为400的圆上绘制图标
    const angle1 = (2 * Math.PI) / radius1Count;
    for (let i = 0; i < radius1Count; i++) {
      const angle = i * angle1;
      const x = width / 2 + radius1 * Math.cos(angle);
      const y = height / 2 + radius1 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius1, angle, icon, direction: -1 });
    }

    // 在半径为310的圆上绘制图标
    const angle2 = (2 * Math.PI) / radius2Count;
    for (let i = 0; i < radius2Count; i++) {
      const angle = i * angle2;
      const x = width / 2 + radius2 * Math.cos(angle);
      const y = height / 2 + radius2 * Math.sin(angle);
      const icon = icons[radius1Count + i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius2, angle, icon, direction: 1 });
    }

    // 在半径为230的圆上绘制剩余的图标
    for (let i = radius1Count + radius2Count; i < icons.length; i++) {
      const angle = (2 * Math.PI * (i - radius1Count - radius2Count)) / (icons.length - radius1Count - radius2Count);
      const x = width / 2 + radius3 * Math.cos(angle);
      const y = height / 2 + radius3 * Math.sin(angle);
      const icon = icons[i];
      stars.push({ x, y, radius: 30, orbitalRadius: radius3, angle, icon, direction: -1 });
    }

    const nodes = svgElement
      .selectAll('.node')
      .data(stars)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .on('click', (event, d) => window.open(d.icon.url));

    nodes
      .append('clipPath')
      .attr('id', (d, i) => `clip-${i}`)
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('cx', 0)
      .attr('cy', 0);

    nodes
      .append('image')
      .attr('href', (d) => d.icon.icon)
      .attr('width', (d) => d.radius * 2)
      .attr('height', (d) => d.radius * 2)
      .attr('x', (d) => -d.radius)
      .attr('y', (d) => -d.radius)
      .attr('clip-path', (d, i) => `url(#clip-${i})`)
      .style('animation', (d) => `blink ${d.duration}s ease-in-out ${d.delay}s infinite alternate`);

    const style = svgElement.append('style');
    style.text(`
      @keyframes blink {
        0% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `);

    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (event) {
        const iconData = d3.select(this).data()[0]; // 获取图标数据对象
        console.log(iconData); // 打印图标数据对象
        return `<span>${iconData.icon.name}</span>`;
      })
      .style('color', 'white') // 设置文本颜色为白色
      .style('background-color', 'rgba(0, 0, 0, 0.8)'); // 设置背景颜色为透明黑色

    nodes
      .datum(function (d) {
        return d; // 绑定图标数据到元素上
      })
      .call(tip);

    nodes
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style('cursor', 'pointer');

      const animate = () => {
        nodes.attr('transform', (d) => {
          const x = width / 2 + d.orbitalRadius * Math.cos(d.angle);
          const y = height / 2 + d.orbitalRadius * Math.sin(d.angle);
          d.angle += d.direction * 0.00015;
          return `translate(${x}, ${y}) rotate(${ 24 * d.angle * (180 / Math.PI)})`; // 同时更新自转角度，公转1圈，自转24圈
        });
        requestAnimationFrame(animate);
      };
      
      animate();
    }, [icons]);
  return <svg ref={svgRef} viewBox="0 0 1620 880"></svg>;
};

export default ProjectIconsSVG;
*/


