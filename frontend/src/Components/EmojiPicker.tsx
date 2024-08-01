// import React, { useEffect, useRef } from 'react';
// import { Picker as EmojiPickerComponent, PickerProps } from 'emoji-mart';
// import data from '@emoji-mart/data';

// // 定义组件的 props 类型
// interface EmojiPickerProps extends PickerProps {}

// const EmojiPicker: React.FC<EmojiPickerProps> = (props) => {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (ref.current) {
//       // 创建 Picker 实例并传入参数
//       new EmojiPickerComponent({ ...props, data, ref: ref.current });
//     }
//   }, [props]);

//   return <div ref={ref} />;
// };

// export default EmojiPicker;
