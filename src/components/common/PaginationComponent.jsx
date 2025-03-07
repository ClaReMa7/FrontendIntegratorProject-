import Pagination from 'react-bootstrap/Pagination'; 
import PropTypes from 'prop-types'; 
import "../../styles/ListProduct.css";

const PaginationComponent = ({ currentPage, totalPages, setCurrentPage }) => {
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    return (
        <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            
            {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                    className='custom-pagination-item'
                >
                    {index + 1}
                </Pagination.Item>
            ))}
            
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
    );
};

PaginationComponent.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired
};

export default PaginationComponent;