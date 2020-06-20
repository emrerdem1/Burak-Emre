import React, { useState, useEffect, useContext, useRef } from 'react';
import db from './../firebaseConfig';
import EditBoardItem from './EditBoardItem';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { BoardStore, PriorityStore } from './BoardSections';
import EditableInput from './Editable/EditableInput';

const BoardItem = ({ boardItem, boardId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [priorities] = useContext(PriorityStore);
  const [statuses] = useContext(BoardStore);
  const [task, setTask] = useState("");
  const inputRef = useRef();
  // const date = boardItem.dueDate ? new Date(boardItem?.dueDate?.seconds * 1000) : '';

  useEffect(() => {
    setTask(boardItem?.title)
  }, [boardItem])

  const deleteBoardItem = id => {
    db.doc(`boards/${boardId}/boardItems/${id}`).delete();
  };

  const doneBoardItem = (item) => {
    const id = statuses.find(status => status.name === 'done')?.id;
    db.doc(`boards/${boardId}/boardItems/${item.id}`).delete();
    db.collection(`boards/${id}/boardItems`).add({
      ...item,
      status: 4,
      position: 9999
    })
  };

  const handleNameChange = item => event => {
    const title = event.target.value;
    setTask(title);
    db.doc(`boards/${boardId}/boardItems/${item.id}`).update({
      title
    });
  };

  const handleOpenModal = boardItem => {
    setShowModal(true);
    setSelectedItem({ ...boardItem });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const getFormattedDate = timeStamp => {
    if (timeStamp) {
      const fullDate = new Date(timeStamp * 1000);
      const date = fullDate.getDate();
      const month = fullDate.getMonth() + 1;
      const year = fullDate.getFullYear();
      return `${date}-${month}-${year}`;
    }
    return '-'
  };

  return (
    <React.Fragment>
      {showModal && (
        <EditBoardItem isOpen={showModal} closeModal={handleCloseModal} selectedItem={selectedItem} boardId={boardId} />
      )}
      <Container className="board-item" draggable onDragStart={(e) => {
        e.dataTransfer.setData("updatedItem", JSON.stringify(boardItem));
        e.dataTransfer.setData("boardId", boardId);
      }} onDragOver={(e) => {
        e.preventDefault();
      }}>
        <Container className="board-item_nested" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className='board-item_nested--id'>
            <h6 className="text-center">
              <EditableInput text={task}
                placeholder="Write a task name"
                childRef={inputRef}
                type="input">
                <input
                  ref={inputRef}
                  type="text"
                  name="task"
                  placeholder="Write a task name"
                  value={task}
                  onChange={handleNameChange(boardItem)}
                />
              </EditableInput>
            </h6>
          </div>
          <ButtonGroup className="edit-delete-buttons">
            <Button
              variant="outline-success"
              size="sm"
              style={{ marginRight: '3px' }}
              onClick={() => doneBoardItem(boardItem)}
            >
              Done
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              style={{ marginRight: '3px' }}
              onClick={() => handleOpenModal(boardItem)}
            >
              Edit
						</Button>
            <Button variant="outline-danger" size="sm" onClick={() => deleteBoardItem(boardItem.id)}>
              Delete
						</Button>
          </ButtonGroup>
        </Container>
        <Container className='board-item_object'>
          <p>SubTitle: {boardItem?.subTitle}</p>
          <p>Assignee: {boardItem?.assignee}</p>
          <p>Description: {boardItem?.description}</p>
          <p>Status: {boardItem.status && statuses.find(status => status.position === boardItem.status)?.name}</p>
          <p>Priority: {boardItem.priority && priorities.find(priority => priority.value === boardItem.priority)?.name}</p>
          <p>dueDate: {getFormattedDate(boardItem?.dueDate?.seconds)}</p>
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default BoardItem;
