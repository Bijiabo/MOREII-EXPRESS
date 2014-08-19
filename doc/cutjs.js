/**
 * Created by boooo on 14-8-19.
 */
//
// ### Loader
// Loaders create and run apps and manage rendering cycles.
// 加载并运行app，并管理渲染周期

// Load an app with root node and container element.
// 使用根节点和容器元素来加载app
Cut(function(root, container) {
    // Your apps goes here, add nodes to the root.
    // 这里是你的app程序，将节点添加到root下。
    // Container is the actual element displaying rendered graphics.
    // 这里的container参数是用来渲染图形的真实dom节点。

    // Pause playing.
    // 暂停播放
    root.pause();

    // Resume playing.
    // 恢复动画播放。
    root.resume();

    // Set view box for root.
    // 设置根节点的视图尺寸
    root.viewbox(width, height);

    // Listen to view port resize events.
    //监听试图尺寸变化
    root.on("viewport", function(width, height) {
    });
});

//
// ### Tree Model
// 树模型，类似DOM树
// Every app consists of a tree. Tree root is provided by the Loader.
// 每个app都包含一个树模型。树模型的根部由loader提供。

// Create new plain node instance. No painting is associated with a plain node,
// it is just a parent for other nodes.
// 创建一个新的空节点实例。没有神马绘制行为，主要是用来作为其他节点的父节点。
var foo = Cut.create();

// Append/prepend bar, baz, ... to foo's children.
// 在父元素开头或结尾添加节点。
foo.append(bar, baz, etc);
foo.prepend(bar, baz, etc);

// Append/prepend bar to foo's children.
// 将节点添加到父元素开头或结尾处。
bar.appendTo(foo);
bar.prependTo(foo);

// Insert baz, qux, ... after/before bar.
// 在节点之前或之后添加节点。
bar.insertNext(baz, qux, etc);
bar.insertPrev(baz, qux, etc);

// Insert baz after/before bar.
// 在节点之前或之后添加节点。
baz.insertAfter(bar);
baz.insertBefore(bar);

// Remove bar from parent.
// 从父节点中移除bar节点
bar.remove();

// Remove bar, baz, ... from foo.
// 批量移除父节点中的子节点。
foo.remove(bar, baz, etc);

// Remove all foo's children.
// 删除父节点中的所有子节点。
foo.empty();

// Get foo's first/last (visible) child.
// 获取父节点的第一个/最后一个子节点。
foo.first(visible = false);
foo.last(visible = false);

// Get immediate parent.
// 获取上一父节点。
bar.parent();

// Get bar's next/prev (visible) sibling.
// 获取前一个/后一个兄弟节点。
bar.next(visible = false);
bar.prev(visible = false);

// Get bar's visiblity.
// 获取节点的可见度。
bar.visible();
// Set bar's visiblity.
// 设置节点的可见度或者能见状态。
bar.visible(visible);
bar.hide();
bar.show();

// Iterate over foo's children, `child` can not be remove.
// 遍历父节点foo中的子节点，在这个过程中子节点不能被删除，否则可能引发错误。
for (var child = foo.first(); child; child = child.next()) {
    // use child
}

// Iterate over foo's children, `child` can be remove.
// 遍历父节点foo中的子节点，在这个过程中子节点可以被删除。
var child, next = foo.first();
while (child = next) {
    next = child.next();
    // use child
}

// Visit foo's sub-tree.
// 访问foo节点的替代树模型？
foo.visit({
    start : function(node) {
        return skipChildren;
    },
    end : function(node) {
        return stopVisit;
    },
    reverse : reverseChildrenOrder = false,
    visible : onlyVisibleNodes = false
});

//
// ### Tick & Touch
// Before every painting the tree is ticked, it is when the app and nodes have
// the chance to update. If at least one node is touched during ticking
// rendering cycles will continue otherwise it would pause until it is touched.
// ### 循环和触控
// 在每次绘制周期运行前的这段时间，可以对节点进行修改。如果最后一个节点在渲染过程中被点击，
// 将继续进行渲染，否则它将停下来等待触控完成。

// Register a ticker to be called on ticking.
// 注册一个ticker
foo.tick(function(millisecElapsed) {
}, beforeChildren = false);

// Rendering pauses unless/until at least one node is touched directly or
// indirectly.
// 一旦触摸节点，立即暂停渲染。
foo.touch();

//
// ### Events
//

// Register a type-listener to bar. `type` can be one or an array of strings or
// spaced strings.
// 给foo的子节点bar注册一个类型监听器，`type`可以是由字符串组成的数组，也可以是由空格隔开的字符串。
foo.on(type, listener);

// Get type-listeners registered to bar.
// 获取bar的类型监听器
foo.listeners(type);

// Call type-listeners with args.
// 调用类型监听器并传参。
foo.publish(type, args);

//
// ### Pinning
// Pinning is a top level concept, it refers to transforming a node relative
// to its parent.
// ### Pinning
// Pinning是一个高级概念。它指的是节点相对于其父节点的相对位置。
// 具体pinning在这里的翻译为中文什么，还没有想好，大概是属性的意思，就叫栓子吧～

// Get a pinning value.
// 获取节点的Pinning值。
bar.pin(name);
// Set a pinning value.
// 设置节点的Pinning值。
bar.pin(name, value);
// Set one or more pinning values.
// 设置一个或多个Pinning值。
bar.pin({
    name : value
});

// Transparency
// 透明度
bar.pin({
    // Transparency applied to self and children.
    // 使用alpha设置的透明度值将应用于节点本身以及其子节点。
    alpha : 1,
    // Transparency applied only to self textures.
    // 仅应用于节点本身。
    textureAlpha : 1
});

// When `nameX` equals `nameY`, `name` shorthand can be used instead.
// 举个栗子，当`scaleX`和`scaleY`相等的时候，丫直接写`scale`就可以了@@。

// Transformation
// 变形
// `rotation` is applied after scale and skew
// 旋转将在缩放和倾斜之后应用。
bar.pin({
    scaleX : 1,
    scaleY : 1,
    skewX : 0,
    skewY : 0,
    rotation : 0
});

// Size
// Usually are set automatically depending on node type.
// 尺寸
// 一般情况下根据节点来自动设置什么的。
bar.pin({
    height : height,
    width : width,
});

// Positioning
// For width/height ratio 0 is top/left and 1 is bottom/right.
// 定位
// 相对于宽度和高度比例，0为上/左，1为下/右
bar.pin({
    // Relative location on self used as scale/skew/rotation center. See handle.
    // 相对于自身的位置
    pivotX : 0,
    pivotY : 0,
    // Pin point on parent used for positioning, as ratio of parent width/height.
    // 相对于父节点的位置，按照父节点的宽高比例来的。
    alignX : 0,
    alignY : 0,
    // Pin point on self used for positioning, defaults to align values,
    // as ratio of aabb or origin (if pivoted) width/height.
    handleX : 0,
    handleY : 0,
    // Distance from parent align to self handle in pixel.
    // 相对于父节点的像素位置
    offsetX : 0,
    offsetY : 0,
});

// Scale to new width/height.
// Optionally use "in" and "out" as mode to scale proportionally.
// 缩放到新的宽高。
// `scaleMode`这一项，根据情况写`in`或者`out`就好了。
bar.pin({
    scaleMode : mode,
    scaleWidth : width,
    scaleHeight : height,
});

// Scale to new width/height and then resize to fill width/height.
// Optionally use "in" and "out" as mode to scale proportionally.
// 缩放到新的宽高并填充到指定大小。
bar.pin({
    resizeMode : mode,
    resizeWidth : width,
    resizeHeight : height,
});

//
// ### Tweening
// Tweening can only be applied to pinning values.
// ### 补间动画/渐变动画
// 这货只能用于pinning值的变化上。

// Create a tweening entry.
// 创建一个渐变条目
var tween = foo.tween(duration = 400, delay = 0);

// Clear tweening queue.
// 清除渐变队列
tween.clear(jumpToEnd = false);

// Set pinning values and start tweening. Currently pinning short-hands are not
// supported for tweening.
// 设置pinning值并启动渐变动画。但是正在处于变动的补间动画将不做改变。
tween.pin(pinning);

// Set easing for tweening. `easing` can be either a function or identifier as
// "name[-mode][(params)]", for example "quad" or "poly-in-out(3)".
// Available names are: linear, quad, cubic, quart, quint, poly(p),
// sin/sine, exp, circle/circ, bounce, elastic(a, p), back(s)
// Available modes are: in, out,in-out, out-in.
// 设置补间动画函数，和jquery的参数有点像吧呀。
tween.ease(function(easing) {
});

// Callback when tweening is over.
// 补间动画完成时的回调函数。
tween.then(function() {
    // this === foo
});

// Add another tweening to queue.
添加另外的补间动画
var nextTween = tween.tween(duration = 400, delay = 0);

//
// ### Image
// An image is a node which pastes a cutout.
// ### 图像
// 图像是cut的一个节点

// Create a new image instance.
// 创建新的image实例。
var image = Cut.image(cutout);

// Change image.
// 修改图像。
image.setImage(cutout);

// Crop image.
// 裁剪图像。
image.cropX(w, x = 0);
image.cropY(h, y = 0);

// Tile/Stretch image to resize to pinning width and height. To define border
// use top, bottom, left and right with cutout definition.
// 平铺/拉伸图像大小调整为钉扎的宽度和高度。要定义边框的使用上，下，左，右带cutout的定义。
image.tile();
image.stretch();

//
// ### Anim(Clip)
// An anim is a node which have a set of cutouts and pastes a cutout at a time.


// Create a new anim instance.
// 创建一个anim实例。
var anim = Cut.anim(cutouts, fps = Cut.Anim.FPS);

// Get or set anim fps.
// 设置anim的每秒帧数。
anim.fps();
anim.fps(fps);

// Set anim frames as cutout prefix. See Cutout section for more.
anim.setFrames("texture:prefix");

// Set anim frames as cutout array. See Cutout section for more.
anim.setFrames(array);

// Go to n-th frame.
anim.gotoFrame(n);

// Move n frames.
anim.moveFrame(n);

// Get number of frames.
anim.length();

// Start playing (from `frame`).
anim.play(frame = null);

// Stop playing (and go to `frame`).
anim.stop(frame = null);

// Play `repeat * length` frames and then stop and call callback.
anim.repeat(repeat, callback = null);

//
// ### Row/Column
// A row/column is a node which organizes its children as a horizontal/vertical
// sequence.

// Create a new row/column.
var row = Cut.row(childrenVerticalAlign = 0);
var column = Cut.column(childrenHorizontalAlign = 0);

// Add spacing between row/column cells.
row.spacing(space);

//
// ### Box
// A box resizes to wrap its children. Can be used with image tile/stretch
// to create variable size components like windows, button, etc.

// Create a new box.
var box = Cut.box();

// Make foo a box.
foo = foo.box();

// Add padding around box.
box.padding(pad);

//
// ### String
// String is a row of images, but images are dynamically assigned using font and
// value.

// Create a new string instance.
var string = Cut.string(cutouts);

// Value is a string or array, each char/item is used to create an image using
// font.
string.setValue(value);

// Set string font as cutout prefix. See Cutout section for more.
string.setFont("texture:prefix");

// Set string font. 'factory' func takes a char/item and return a cutout.
string.setFont(function(charOrItem) {
    return aCutout;
});

//
// ### Cutout
// Image cutouts are used to refrence graphics to be painted.

// Cutouts are usually added to an app by adding textures.
Cut.addTexture(texture = {
    name : textureName,
    imagePath : textureImagePath,
    imageRatio : 1,
    cutouts : [ { // list of cutoutDefs or cutouts
        name : cutoutName,
        x : x,
        y : y,
        width : width,
        height : height,
        top : 0,
        bottom : 0,
        left : 0,
        right : 0
    }, etc ],

    // `cutouts` are passed through `map`, they can be modifed here.
    map : function(cutoutDef) {
        return cutoutDef;
    },

    // `factory` is called when a cutoutName is not found in `cutouts`.
    factory : function(cutoutName) {
        // Dynamically create a cutoutDef or cutout.
        return cutoutDef; // or cutout
    }
}, etc);

// Then texture cutouts can be referenced through the app.
Cut.image(cutout = "textureName:cutoutName");

// Cutouts can also be created using Canvas drawing.
Cut.image(cutout = Cut.Out.drawing(name = randomString, width, height,
    ratio = 1, function(context, ratio) {
        // context is a 2D Canvas context created using width and height.
        // this === create cutout
    }));

// There is also a shorthand for that.
Cut.drawing();

// Canvas drawing can also be used in `texture.cutout` and `texture.factory` to
// creat cutouts instead of using cutoutDef.
Cut.addTexture(texture = {
    name : textureName,

    cutouts : [ Cut.Out.drawing(), etc ],

    factory : function(cutoutName) {
        return Cut.Out.drawing();
    }
}, etc);

//
// ### Mouse(Touch)
// Mouse class is used to capture and process mouse and touch events.

// Subscribe root to Mouse events.
Cut.Mouse(root, container, captureAnyMove = false);

// Add click listener to bar.
bar.on(Cut.Mouse.CLICK, function(event, point) {
    // point.x and point.y are relative to this node left and top.
    return trueToStopPropagating;
});

// Mouse events:
Cut.Mouse.CLICK = "click";
Cut.Mouse.START = "touchstart mousedown";
Cut.Mouse.MOVE = "touchmove mousemove";
Cut.Mouse.END = "touchend mouseup";

//
// ### Creating new node classes.
//

function View() {
    View.prototype._super.apply(this, arguments);
    // ...
}
View.prototype = Object.create(Cut.prototype);
View.prototype._super = Cut;
View.prototype.constructor = View;