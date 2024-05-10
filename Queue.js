class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enqueue(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    dequeue() {
        if (!this.head) return null;
        const removedNode = this.head;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null;
        }
        this.size--;
        return removedNode.data;
    }
}

export default Queue;